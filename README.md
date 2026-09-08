# Fiat Coaching Portal

A private portal for your Catholic business coaching clients: session
notes, homework, training videos, and prayers. Each client sees only their
own notes and homework; everyone sees the shared videos and prayers.

It's a plain HTML/JS site — no build step, no backend, no account to set
up. It works directly on GitHub Pages the moment you turn it on.

Each real page (`index.html`, `dashboard.html`, `resources.html`,
`prayers.html`, `admin.html`) is self-contained — its styling lives right
inside that file, not in a shared stylesheet. The one exception is your
client roster: it stays in a single shared file, `js/clients-data.js`, so
you only ever have to update a client's info in one place instead of five.

---

## ⚠️ Important — read this first

This site has **no real server checking passwords**. A client "logging in"
just means the page checks their name and password against a list stored
in the site's own code (`js/clients-data.js`), then remembers them on that
device using the browser's local storage (so they stay signed in on
return visits). That means:

- Since your GitHub repo is **public**, anyone who finds the link — or
  simply browses your repo's files directly on GitHub — can see every
  client's name, session notes, homework, and password in plain text.
- This is fine for a small group of trusted clients who understand it's a
  simple, low-stakes system. It is **not** appropriate if you ever handle
  anything genuinely sensitive.
- If you want real privacy later, either (a) make the GitHub repo private
  (requires a paid GitHub plan for Pages to still work), or (b) switch to
  a real login system — ask me to help set that back up if you get there.

## How it works

- **`index.html`** — the sign-in page. Checks the name/password someone
  types against the `CLIENTS` list in `js/clients-data.js`.
- **`dashboard.html`** — a client's homework and session notes, pulled
  from their entry in `CLIENT_CONTENT` in `js/clients-data.js`.
- **`resources.html`** / **`prayers.html`** — shared with every client,
  also stored in `js/clients-data.js`.
- **`admin.html`** — a list of your clients with a "View as this client"
  button, so you can see exactly what each person sees. It doesn't let you
  edit anything directly — that happens in the data file (next section).

## Adding or updating a client

Everything lives in **`js/clients-data.js`**, split into two lists that
work together:

- **`CLIENTS`** — just their sign-in: `'username': 'password'`
- **`CLIENT_CONTENT`** — everything they see, keyed by that same username:
  their display name, homework, and session notes

**To add a new client:**
1. In `CLIENTS`, add a line: `'jane': 'somepassword',`
2. In `CLIENT_CONTENT`, copy the `'mary': { ... }` block, change the key
   to `'jane'` (matching what you used above), and update `name`,
   `homework`, and `sessionNotes`.

**To add homework for a client:** inside their `CLIENT_CONTENT` block, add
an entry to their `homework` list:
```js
{ title: "...", dueDate: "...", description: "...", completed: false }
```

**To add a session note:** add an entry to their `sessionNotes` list:
```js
{ title: "...", date: "...", content: "..." }
```

**To add a training video or prayer:** add an entry to the shared
`TRAINING_VIDEOS` or `PRAYERS` list near the bottom of the file, following
the existing examples.

After any edit, save the file and commit the change on GitHub (or push
from your computer) — the live site updates within a minute or two.

## Put it on GitHub Pages

1. Push all these files to a GitHub repository named `fiat-coaching-portal`
   — make sure the files sit at the **top level** of the repo, not inside
   a subfolder.
2. In the repo, go to **Settings > Pages**. Under **Source**, choose the
   `main` branch and `/ (root)`, then save.
3. GitHub gives you a URL like `https://yourusername.github.io/fiat-coaching-portal/`
   — that's your live client portal.

## Practice Portal — learn and experiment safely

This project also includes a second, separate copy of the site for
practicing: **`practice.html`** and the `practice-*.html` pages, backed by
`css/style.css` and their own `js/practice-*.js` files.

- It looks and behaves like the real portal, but stores its sample data in
  your browser's `localStorage` under different keys — so nothing you do
  there touches your real clients.
- Open `practice.html` and choose to enter as Admin or as a Client.
- There's a **Reset practice data** button in the practice admin view if
  you want to wipe your experiments and start over.

This is the safest place to try layout or style changes before making the
same change to the real files.
