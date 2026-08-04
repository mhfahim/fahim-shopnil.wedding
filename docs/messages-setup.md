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
3. At the bottom left, rename the tab from `Sheet1` to exactly **`Messages`**
   (double-click the tab name). The capital M matters.

Leave it empty. The script writes the header row itself the first time
someone submits.

---

## 2. Add the script

1. In the Sheet, menu: **Extensions → Apps Script**. A code editor opens in a
   new tab.
2. Delete whatever is in the editor.
3. Paste everything in the block below.
4. Change the two lines at the top marked `CHANGE THIS`.
5. Click the **save** icon (or Ctrl+S).

```javascript
/**
 * Receives messages from the wedding invitation and files them in this Sheet.
 * Paired with app/api/messages/route.ts.
 */

// CHANGE THIS: invent a long random string. It must match the value you put
// in Vercel as MESSAGES_WEBHOOK_TOKEN. Treat it like a password.
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

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, error: 'empty request' });
    }

    const body = JSON.parse(e.postData.contents);

    if (body.token !== TOKEN) {
      return reply({ ok: false, error: 'unauthorised' });
    }

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      return reply({ ok: false, error: 'no sheet named ' + SHEET_NAME });
    }

    // Write the header row once, on the first message.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const attending = body.attending === 'accept'
      ? 'Joyfully accepts'
      : 'Regretfully declines';

    sheet.appendRow([
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

1. Top right of the Apps Script editor: **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description**: anything, e.g. `messages`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. Google asks you to authorise. Click through: **Authorize access** → pick your
   account → **Advanced** → **Go to (project name)** → **Allow**. The scary
   "unverified app" warning is expected; it is your own script.
6. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy.../exec`.

> **"Who has access: Anyone" does not mean anyone can read your messages.**
> It means the URL can be called without a Google login, which is what lets the
> website reach it. The `TOKEN` is what actually guards it, and the script only
> ever writes — there is no way to read the Sheet back out through it.

---

## 4. Tell the website about it

In Vercel: **your project → Settings → Environment Variables**. Add two, for
all environments:

| Key | Value |
| --- | --- |
| `MESSAGES_WEBHOOK_URL` | the Web app URL from step 3 |
| `MESSAGES_WEBHOOK_TOKEN` | the exact `TOKEN` string from step 2 |

Then **Deployments → ⋯ on the newest one → Redeploy**. Environment variables
are only picked up by a fresh build.

For local development, put the same two lines in a `.env.local` file — see
`.env.example`.

---

## 5. Check it works

Open the live site, scroll to **Send a Message**, and submit a test.

- A row appears in the Sheet within a second or two.
- An email arrives at `NOTIFY_EMAIL`.

If instead the form says *"That did not go through"*, the message was **not**
lost silently — that is the form telling you the delivery failed, and what you
typed is still in the boxes. Check the table below.

---

## If something goes wrong

| What you see | Cause | Fix |
| --- | --- | --- |
| "That did not go through" straight away | Env vars missing or not redeployed | Redo step 4, including the redeploy |
| Same, after correct setup | `TOKEN` mismatch | The Vercel value and the script value must match exactly — no quotes, no trailing spaces |
| Nothing in the Sheet, no error | Tab is not named `Messages` | Rename the tab exactly, capital M |
| Emails stop arriving, rows still appear | Gmail's daily send quota | Rows are still safe; the Sheet is the record |

Vercel's **Logs** tab shows the reason for any failure, and the failed message
is written into the log as well, so it is recoverable even then.

---

## Changing the script later

Editing the code is not enough — Apps Script serves the last *deployed*
version. After any edit: **Deploy → Manage deployments → pencil icon →
Version: New version → Deploy**. The URL stays the same, so nothing needs
changing in Vercel.
