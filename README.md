# Hanna Center Dashboards — Static Site

A small static site bundling all fundraising dashboards behind a simple password gate.

```
site/
├── index.html                          ← landing page + password gate
├── assets/
│   └── gate.js                         ← shared auth logic
└── dashboards/
    ├── fundraisingperformancefy26.html
    ├── campaign-revenue.html
    ├── fy26-progress-to-goal.html
    └── weekly-giving-070626.html
```




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
