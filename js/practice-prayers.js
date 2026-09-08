renderPrayers();

function renderPrayers() {
  const list = document.getElementById("prayer-list");
  const items = pStoreGet("prayers");
  if (!items.length) { list.innerHTML = '<div class="empty-state">No prayers posted yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (p) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      (p.category ? '<div class="tag">' + esc(p.category) + "</div>" : "") +
      '<div class="entry-title">' + esc(p.title) + "</div>" +
      '<div class="prayer-text">' + esc(p.text) + "</div>";
    list.appendChild(el);
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
