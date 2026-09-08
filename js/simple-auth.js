/* ============================================
   Simple login — checks the CLIENTS map in clients-data.js.
   Not real security (see README) — just enough to keep casual
   visitors out and give each client their own view.

   Uses localStorage (not sessionStorage) so a client stays signed
   in on return visits from the same device/browser, the same way
   the Rooted in Real Life portal does.
   ============================================ */

function attemptLogin(username, password) {
  const key = username.trim().toLowerCase();
  if (CLIENTS[key] !== undefined && CLIENTS[key] === password) {
    localStorage.setItem("fiat_current_user", key);
    return true;
  }
  return false;
}

function getLoggedInClient() {
  const username = localStorage.getItem("fiat_current_user");
  if (!username || !CLIENT_CONTENT[username]) return null;
  return Object.assign({ username: username }, CLIENT_CONTENT[username]);
}

function requireClientLogin() {
  const client = getLoggedInClient();
  if (!client) {
    window.location.href = "index.html";
    return null;
  }
  return client;
}

function logout() {
  localStorage.removeItem("fiat_current_user");
  localStorage.removeItem("fiat_admin_preview");
  window.location.href = "index.html";
}

function wireLogoutSimple(buttonId) {
  const btn = document.getElementById(buttonId);
  if (btn) btn.addEventListener("click", logout);
}

function renderPreviewBanner() {
  const el = document.getElementById("preview-banner");
  if (!el) return;
  if (localStorage.getItem("fiat_admin_preview") === "1") {
    const client = getLoggedInClient();
    el.className = "practice-banner";
    el.innerHTML =
      "\uD83D\uDC41 Admin preview — viewing as " + (client ? client.name : "client") +
      '. <a href="#" id="exit-preview-link">Exit preview</a>';
    document.getElementById("exit-preview-link").addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("fiat_admin_preview");
      localStorage.removeItem("fiat_current_user");
      window.location.href = "admin.html";
    });
  }
}
