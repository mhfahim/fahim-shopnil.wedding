import { NextResponse } from "next/server";
import { messageSchema } from "@/lib/rsvp";

const WEBHOOK_URL = process.env.MESSAGES_WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.MESSAGES_WEBHOOK_TOKEN;

/**
 * Guests' messages go to a Google Sheet through an Apps Script web app.
 * See docs/messages-setup.md.
 *
 * Nothing here ever answers "ok" unless the message really landed. A guest
 * seeing "Thank you" for a message that was quietly dropped is the one
 * outcome worth avoiding: the form's retry path keeps what they typed, so a
 * visible failure is recoverable and a silent one is not.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  if (!WEBHOOK_URL || !WEBHOOK_TOKEN) {
    // A deploy-time mistake, not the guest's fault. Log the message so it is
    // at least recoverable from the runtime logs, and fail visibly so the
    // misconfiguration surfaces the first time anyone tests the form.
    console.error(
      "[messages] MESSAGES_WEBHOOK_URL / MESSAGES_WEBHOOK_TOKEN are not set. Message not stored:",
      JSON.stringify(parsed.data),
    );
    return NextResponse.json(
      { error: "Messages are not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: WEBHOOK_TOKEN, ...parsed.data }),
      // Apps Script follows a redirect to googleusercontent before replying.
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

    // Apps Script answers 200 whatever happens, so the body is the real
    // outcome — checking response.ok alone would report false successes.
    const raw = await response.text();

    let result: { ok?: boolean; error?: string } | null = null;
    try {
      result = JSON.parse(raw);
    } catch {
      // Left null: a non-JSON reply is almost always Google's sign-in page,
      // which means the deployment's "Who has access" is not set to Anyone.
    }

    if (!response.ok || !result?.ok) {
      throw new Error(
        `webhook rejected (HTTP ${response.status}): ${
          result?.error ??
          `reply was not JSON, which usually means the Apps Script deployment is not set to "Anyone". First 200 characters: ${raw.slice(0, 200)}`
        }`,
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(
      "[messages] delivery failed. Message was:",
      JSON.stringify(parsed.data),
      error,
    );
    return NextResponse.json(
      { error: "Could not deliver the message" },
      { status: 502 },
    );
  }
}
