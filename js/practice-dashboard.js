renderHomework();
renderNotes();

function renderHomework() {
  const list = document.getElementById("homework-list");
  const items = pStoreGet("homework");
  if (!items.length) { list.innerHTML = '<div class="empty-state">No homework assigned yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (hw) {
    const el = document.createElement("div");
    el.className = "entry" + (hw.completed ? " done" : "");
    el.innerHTML =
      '<div class="entry-title">' + esc(hw.title) + "</div>" +
      '<div class="entry-meta">' + (hw.dueDate ? "Due " + esc(hw.dueDate) : "No due date") + "</div>" +
      '<div class="entry-body">' + esc(hw.description || "") + "</div>" +
      '<div class="entry-actions"><button class="btn btn-secondary toggle-btn" data-id="' + hw.id + '">' +
      (hw.completed ? "Mark not done" : "Mark done") + "</button></div>";
    list.appendChild(el);
  });
  list.querySelectorAll(".toggle-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const items = pStoreGet("homework");
      const hw = items.find(function (h) { return h.id === btn.getAttribute("data-id"); });
      if (hw) hw.completed = !hw.completed;
      pStoreSet("homework", items);
      renderHomework();
    });
  });
}

function renderNotes() {
  const list = document.getElementById("notes-list");
  const items = pStoreGet("notes");
  if (!items.length) { list.innerHTML = '<div class="empty-state">No session notes yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (note) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      '<div class="entry-title">' + esc(note.title) + "</div>" +
      '<div class="entry-meta">' + esc(note.createdAt || "") + "</div>" +
      '<div class="entry-body">' + esc(note.content || "") + "</div>";
    list.appendChild(el);
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
