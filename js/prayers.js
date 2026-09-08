requireAuth(function (user, userData) {
  document.getElementById("sidebar-name").textContent = userData.name || user.email;
  loadPrayers();
});

wireLogout("logout-btn");

function loadPrayers() {
  const list = document.getElementById("prayer-list");
  db.collection("prayers").orderBy("order", "asc").get()
    .then(function (snap) {
      if (snap.empty) {
        list.innerHTML = '<div class="empty-state">No prayers posted yet — check back soon.</div>';
        return;
      }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const p = doc.data();
        const wrap = document.createElement("div");
        wrap.className = "entry";
        wrap.innerHTML =
          (p.category ? '<div class="tag">' + escapeHtmlP(p.category) + "</div>" : "") +
          '<div class="entry-title">' + escapeHtmlP(p.title) + "</div>" +
          '<div class="prayer-text">' + escapeHtmlP(p.text) + "</div>";
        list.appendChild(wrap);
      });
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<div class="empty-state">Couldn\'t load prayers right now.</div>';
    });
}

function escapeHtmlP(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
