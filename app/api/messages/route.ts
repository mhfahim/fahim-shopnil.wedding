import { NextResponse } from "next/server";
import { messageSchema, type MessagePayload } from "@/lib/rsvp";

interface StoredMessage extends MessagePayload {
  receivedAt: string;
}

/**
 * TODO: swap for a database or a Google Sheet webhook.
 * This array lives in the server process and is lost on restart — it is a
 * placeholder so the form has a real endpoint to talk to, nothing more.
 */
const messages: StoredMessage[] = [];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body" },
      { status: 400 },
    );
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  messages.push({ ...parsed.data, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true }, { status: 201 });
}
