# Receiving guests' messages

The "Send a Message" form at the bottom of the invitation delivers to a Google
Sheet. You read replies in the Sheet, and you get an email each time someone
writes in.

Nothing here costs anything, and unlike a hosted database there is nothing that
sleeps, expires or needs a card on file.

**One-time setup, about ten minutes.** You only ever do this once.

---

## 1. Make the Sheet

1. Go to <https://sheets.new> — a blank spreadsheet opens.
2. Name it something like **Wedding Messages**.
3. Copy its **ID** out of the address bar. The URL looks like:

   ```
   https://docs.google.com/spreadsheets/d/1AbC...long...XyZ/edit#gid=0
                                          ^^^^^^^^^^^^^^^^^^ this part
   ```

   You need the piece between `/d/` and `/edit`. Keep it handy.

You do not need to create or rename any tab — the script makes the `Messages`
tab and its header row by itself.

---

## 2. Add the script

1. In the Sheet, menu: **Extensions → Apps Script**. A code editor opens.
2. Delete whatever is in the editor.
3. Paste everything in the block below.
4. Change the three lines marked `CHANGE THIS`.
5. Click **save** (Ctrl+S).

```javascript
/**
 * Receives messages from the wedding invitation and files them in a Sheet.
 * Paired with app/api/messages/route.ts.
 */

// CHANGE THIS: the id from your Sheet's URL, between /d/ and /edit.
// Naming the file explicitly means this works whether the script is bound to
// the Sheet or standalone - getActiveSpreadsheet() silently returns the wrong
// file (or none) and is the single most common way this setup fails.
const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE';

// CHANGE THIS: invent a long random string. It must match the value you put
// in Vercel as MESSAGES_WEBHOOK_TOKEN. Treat it like a password. Avoid
// characters that are easy to confuse: I l 1, O 0.
const TOKEN = 'replace-me-with-a-long-random-string';

// CHANGE THIS: where the "you have a new message" emails go.
const NOTIFY_EMAIL = 'you@example.com';

const SHEET_NAME = 'Messages';
const HEADERS = ['Received', 'Name', 'Email', 'Attending', 'Message'];

function reply(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Opens the Messages tab, creating it and its header row if missing. */
function getSheet() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Health check. Open the /exec URL in a browser and you get JSON telling you
 * exactly what the script can and cannot reach. It never reveals the token.
 */
function doGet() {
  try {
    const sheet = getSheet();
    return reply({
      ok: true,
      service: 'wedding-messages',
      spreadsheet: sheet.getParent().getName(),
      sheetFound: true,
      rows: Math.max(0, sheet.getLastRow() - 1),
      tokenSet: TOKEN !== 'replace-me-with-a-long-random-string',
      tokenLength: String(TOKEN).length,
    });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, error: 'empty request' });
    }

    const body = JSON.parse(e.postData.contents);

    if (body.token !== TOKEN) {
      return reply({ ok: false, error: 'unauthorised' });
    }

    const attending = body.attending === 'accept'
      ? 'Joyfully accepts'
      : 'Regretfully declines';

    getSheet().appendRow([
      new Date(),
      body.name || '',
      body.email || '',
      attending,
      body.message || '',
    ]);

    // Best effort: a failed email must never lose the message, which is
    // already safely in the Sheet by this point.
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'Wedding invitation: message from ' + (body.name || 'a guest'),
        body: [
          'Name:      ' + (body.name || ''),
          'Email:     ' + (body.email || ''),
          'Attending: ' + attending,
          '',
          (body.message || '(no message)'),
        ].join('\n'),
      });
    } catch (mailError) {
      console.error('email failed', mailError);
    }

    return reply({ ok: true });
  } catch (error) {
    console.error(error);
    return reply({ ok: false, error: String(error) });
  }
}
```

---

## 3. Publish it

1. Top right: **Deploy → New deployment**.
2. Gear next to "Select type" → **Web app**.
3. Set:
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. Authorise: **Authorize access** → pick your account → **Advanced** →
   **Go to (project name)** → **Allow**.

   The "Google hasn't verified this app" warning is expected — it is your own
   script. Do **not** click the developer email address on that screen; it is a
   `mailto:` link and just opens your mail app. Click the small
   **"Go to … (unsafe)"** link at the bottom.
6. Copy the **Web app URL** — it ends in `/exec`.

> **"Who has access: Anyone" does not expose your messages.** It means the URL
> can be called without a Google login, which is what lets the website reach
> it. The `TOKEN` guards it, and `doPost` only ever writes.

---

## 4. Confirm the script is healthy

Paste the `/exec` URL into a browser. You want:

```json
{"ok":true,"service":"wedding-messages","spreadsheet":"Wedding Messages",
 "sheetFound":true,"rows":0,"tokenSet":true,"tokenLength":29}
```

Check `spreadsheet` names **your** file. That one field is what proves the
script is writing where you think it is.

| What you get | Meaning |
| --- | --- |
| The JSON above | Healthy. Any later failure is the URL or token in Vercel |
| `ok:false` with an error mentioning permission or id | `SPREADSHEET_ID` is wrong |
| `tokenSet: false` | You never changed `TOKEN` from the placeholder |
| A Google **sign-in page** | Deployment is not shared with **Anyone** |
| `Script function not found: doGet` | You are on an **older deployment** |

That last one is the trap worth remembering: **editing and saving changes
nothing on the live URL until you deploy.**

Do not continue until this shows `sheetFound: true`.

---

## 5. Tell the website about it

In Vercel, open your project and go to:

```
Settings -> Environment Variables
```

The quickest route is to take your project's URL and append
`/settings/environment-variables`.

> **Do not click "Create Environment" on the Settings → Environments page.**
> That makes an extra custom environment and is a paid Pro feature. It has
> nothing to do with this. If the Environments page is all you can see, click
> the **Production** row to reach its variables.

Add two, ticked for **Production, Preview and Development**:

| Key | Value |
| --- | --- |
| `MESSAGES_WEBHOOK_URL` | the Web app URL from step 3 |
| `MESSAGES_WEBHOOK_TOKEN` | the exact `TOKEN` string from step 2 |

Paste both rather than typing them. No quotes, no trailing spaces.

Then **Deployments → ⋯ on the newest → Redeploy**. Environment variables are
only picked up by a fresh build.

For local development, put the same two lines in `.env.local` — see
`.env.example`.

---

## 6. Check it end to end

Open the live site, scroll to **Send a Message**, submit a test.

- A row appears in the Sheet within a second or two.
- An email arrives at `NOTIFY_EMAIL`.

If the form says *"That did not go through"*, the message was **not** lost
silently — that is the form telling you delivery failed, and what you typed is
still in the boxes.

---

## If something goes wrong

| What you see | Cause | Fix |
| --- | --- | --- |
| "That did not go through" immediately | Env vars missing or not redeployed | Redo step 5, including the redeploy |
| Same, after correct setup | `TOKEN` mismatch | The Vercel value and the script value must match exactly |
| Health check fine, form still fails | Vercel holds an **old** `/exec` URL | A new deployment mints a new URL — re-copy it |
| Emails stop, rows still appear | Gmail's daily quota | Rows are safe; the Sheet is the record |

Vercel's **Logs** tab gives the reason verbatim, and writes the failed message
into the log too, so it is recoverable even then.

---

## Changing the script later

Editing is not enough — Apps Script serves the last **deployed** version.
After any edit: **Deploy → Manage deployments → pencil icon → Version: New
version → Deploy**. The URL stays the same that way.
