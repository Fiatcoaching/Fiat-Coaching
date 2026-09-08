# Fiat Coaching Portal

A private portal for your Catholic business coaching clients: session notes,
homework, training videos, and prayers, each client sees only their own notes
and homework, everyone sees the shared videos and prayers.

It's a plain HTML/CSS/JS site — no build step — so it works directly on
GitHub Pages. It uses **Firebase** (free tier) for login and storing data.

---

## Step 1 — Create your Firebase project (~5 min)

1. Go to https://console.firebase.google.com and sign in with any Google account.
2. Click **Add project**, name it something like `coaching-portal`, and finish the wizard (you can skip Google Analytics).
3. Once created, click the **web icon (`</>`)** to register a web app. Name it anything.
4. Firebase will show you a `firebaseConfig` object. Copy it.
5. Open `js/firebase-init.js` in this project and paste your values in place of `YOUR_API_KEY`, etc.

## Step 2 — Turn on Authentication

1. In the Firebase console, go to **Build > Authentication > Get started**.
2. Click the **Email/Password** provider and enable it.

## Step 3 — Turn on Firestore (the database)

1. Go to **Build > Firestore Database > Create database**.
2. Choose **Production mode**, pick a location close to you, and finish.
3. Go to the **Rules** tab and replace the contents with the rules in
   `firestore.rules` (in this project — copy/paste them in and click Publish).
   These rules make sure clients can only ever see their own homework and
   session notes, never anyone else's.

## Step 4 — Add yourself as admin

1. In **Authentication > Users**, click **Add user**. Use your own email and
   a password.
2. In **Firestore Database > Data**, click **Start collection**, name it
   `users`. For the document ID, paste in the **User UID** shown next to the
   user you just created (click the user row in Authentication to see it).
3. Add these fields to that document:
   - `name` (string) — your name
   - `email` (string) — your email
   - `role` (string) — `admin`
4. Save. You can now sign in at `index.html` with that email/password and
   you'll land on the admin console.

## Step 5 — Add a new client

Whenever you take on a new client:

1. **Authentication > Users > Add user** — use their email and set a
   temporary password (text or email it to them; they can't reset it
   themselves yet since there's no "forgot password" flow built in — you can
   add one later if you want).
2. Copy their **User UID**.
3. In **Firestore Database > Data**, open the `users` collection, click
   **Add document**, and use their UID as the document ID.
4. Add fields:
   - `name` (string)
   - `email` (string)
   - `role` (string) — `client`
5. That's it — they can now sign in and you'll see them in the client
   dropdown on your Admin Console to add notes and homework.

## Step 6 — Put it on GitHub Pages

1. Create a new repository on GitHub (can be private or public — private is
   fine for GitHub Pages if you're on a paid plan; on the free plan, GitHub
   Pages sites are public even from a private repo unless you upgrade, so
   don't put anything sensitive directly in the code — all real client data
   lives in Firebase, not in these files).
2. Push all these files to that repository.
3. In the repo, go to **Settings > Pages**. Under **Source**, choose the
   `main` branch and `/ (root)`, then save.
4. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`
   — that's your live client portal. Share `index.html`'s URL with clients.

## Everyday use

- **You (admin)**: sign in → lands on the Admin Console. Pick a client from
  the dropdown to add their homework/session notes. Use the other two tabs
  to manage the shared Training Videos and Prayers libraries.
- **Clients**: sign in → see their own dashboard with homework and session
  notes, plus the shared Training Videos and Prayers pages from the sidebar.

## Practice Portal — learn and experiment safely

This project includes a second, self-contained copy of the site for
practicing: **`practice.html`** and the `practice-*.html` pages.

- It looks and behaves just like the real portal, but it doesn't use
  Firebase at all — it stores its sample data in your browser's
  `localStorage` instead.
- Nothing you do here can affect your real Firebase data or your real
  clients — it's completely separate.
- Open `practice.html` (either straight from GitHub Pages once it's live,
  or by double-clicking the file on your computer) and choose to enter as
  Admin or as a Client.
- As Admin, you can add/delete homework, session notes, videos, and
  prayers, and see them show up the way a client would.
- There's a **Reset practice data** button in the practice admin view if
  you want to wipe your experiments and start over from the sample data.

This is the safest place to try edits to `css/style.css`, tweak the
homework form, add a new field, etc. — since the practice pages share the
same stylesheet as the real ones, anything you learn here carries straight
over. Once you're happy with a change, apply the same edit to the matching
real file (e.g. `dashboard.html` / `js/dashboard.js`) so it shows up for
actual clients too.

## What this doesn't include (on purpose, given "just a handful" of clients)

- **Scheduling** — since you currently book in person/by text, there's no
  calendar built in. If that changes, a Calendly embed can be added to the
  dashboard in a few lines.
- **Password reset / self-signup** — you create every account by hand in the
  Firebase Console, which is quick at this scale. Worth automating once you
  have more than a handful of clients.
- **File uploads** (PDFs, worksheets) — videos are linked via YouTube/Vimeo
  and prayers are typed text; if you want downloadable files too, Firebase
  Storage can be added later.
