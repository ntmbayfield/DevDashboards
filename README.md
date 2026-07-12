# Hanna Center Dashboards — Static Site

A small static site bundling all four fundraising dashboards behind a simple
password gate, ready to deploy on GitHub Pages.

```
site/
├── index.html                          ← landing page + password gate
├── assets/
│   └── gate.js                         ← shared auth logic
└── dashboards/
    ├── fundraising-performance-fy26.html
    ├── campaign-revenue.html
    ├── fy26-progress-to-goal.html
    └── weekly-giving.html
```

## ⚠️ Read this before you publish

**GitHub Pages has no real access control — every file in this repo is
publicly downloadable by anyone who has (or guesses) the URL, password gate
or not.** The password prompt is implemented in JavaScript that runs in the
visitor's browser. It will stop:

- Casual visitors who stumble on the link
- Search engines (the pages are also marked `noindex`)
- Anyone without basic technical know-how

It will **not** stop someone who:

- Views the page source or opens browser dev tools
- Fetches the dashboard URLs directly (e.g. `.../dashboards/weekly-giving.html`)
- Downloads the repo itself if it's a public GitHub repo

Two of these dashboards contain real donor names and gift amounts. If that
level of protection isn't good enough for your data — and for donor PII, it
often isn't — consider one of these instead, in order of effort:

1. **Make the GitHub repo private** and use GitHub Pages' private-repo
   publishing (requires GitHub Pro, Team, or Enterprise for private Pages;
   viewers must log in with a GitHub account that has repo access — no
   shared password, but real authentication).
2. **Put the site behind Cloudflare Access** (free tier available) in front
   of GitHub Pages or any static host — this adds real, server-side login
   (email one-time-code or SSO) rather than a client-side password.
3. **Use a host with built-in password protection**, like Netlify's paid
   tier, which enforces the password server-side before the page is ever
   served.

If this is just an internal convenience link for staff who already know not
to share it, the simple gate below is a reasonable, low-effort choice.

## Deploying to GitHub Pages

1. **Create a new repository** on GitHub (public or private — see caveat
   above), e.g. `hanna-center-dashboards`.
2. **Add these files** to the repo, keeping the folder structure above. From
   this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial dashboard site"
   git branch -M main
   git remote add origin https://github.com/<your-org>/<your-repo>.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**: in the repo, go to *Settings → Pages*. Under
   "Build and deployment," set Source to **Deploy from a branch**, branch
   `main`, folder `/ (root)`. Save.
4. GitHub will publish the site at
   `https://<your-org>.github.io/<your-repo>/` within a minute or two.

## Changing the password

The default password is **`changeme2026`** — change it before sharing the
link. In `assets/gate.js`:

1. Open a browser console (any browser, any page) and run:
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
     .then(b => console.log(Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')))
   ```
2. Copy the printed hash.
3. In `assets/gate.js`, replace the value of `PASSWORD_HASH` with it.
4. Commit and push the change.

## How the gate works

- `index.html` prompts for a password, hashes it (SHA-256) in the browser,
  and compares it to the stored hash in `gate.js`.
- On a correct match, it sets a flag in `sessionStorage` (cleared when the
  browser tab/session ends) and reveals the dashboard menu.
- Each dashboard page includes a small guard script that checks for this
  flag and redirects back to `index.html` if it's missing — this stops
  someone from bookmarking a dashboard URL directly and skipping the gate
  in normal browsing, though (per the caveat above) it doesn't stop someone
  who fetches the file directly rather than navigating in a browser.
