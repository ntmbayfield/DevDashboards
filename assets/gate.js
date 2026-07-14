// Shared client-side access gate for the Hanna Center dashboard site.
//
// IMPORTANT: This is a deterrent, not real security. GitHub Pages serves
// every file publicly; this script only hides content from casual visitors
// in a normal browser session. Anyone who views page source, inspects
// network requests, or fetches the file directly can bypass it. Do not
// rely on this alone to protect sensitive donor data from a determined
// person — see the README for stronger options (Cloudflare Access, a
// private host with real login, etc.)
//
// TO CHANGE THE PASSWORD:
//   1. Pick a new password.
//   2. Get its SHA-256 hash. In any browser console:
//        crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourNewPassword'))
//          .then(b => console.log(Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')))
//   3. Replace PASSWORD_HASH below with the printed value.



const PASSWORD_HASH = '538d50030aab843da02810d4a4ab906a7b6c05b6e63374fff1a9e0479e08dece';  //new password: HC17000@rnold

const SESSION_KEY = 'hc_dashboards_authed';

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function setAuthed() {
  sessionStorage.setItem(SESSION_KEY, '1');
}

async function tryPassword(pw) {
  const hash = await sha256Hex(pw);
  if (hash === PASSWORD_HASH) {
    setAuthed();
    return true;
  }
  return false;
}

// Called at the top of every dashboard page. Redirects back to the
// gate if the visitor hasn't authenticated this session.
function requireAuth(redirectTo) {
  if (!isAuthed()) {
    window.location.href = redirectTo;
  }
}
