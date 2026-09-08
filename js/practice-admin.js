/* ---------------- Tabs ---------------- */
document.querySelectorAll(".nav-item[data-tab]").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".nav-item[data-tab]").forEach(function (l) { l.classList.remove("active"); });
    link.classList.add("active");
    ["client-tab", "videos-tab", "prayers-tab"].forEach(function (id) {
      document.getElementById(id).style.display = id === link.getAttribute("data-tab") ? "block" : "none";
    });
  });
});

document.getElementById("reset-btn").addEventListener("click", function () {
  if (!confirm("Reset all practice data back to the sample starting point?")) return;
  pStoreResetAll();
  renderAdminHomework();
  renderAdminNotes();
  renderAdminVideos();
  renderAdminPrayers();
});

/* ---------------- Homework ---------------- */
document.getElementById("homework-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("hw-title").value.trim();
  const dueDate = document.getElementById("hw-due").value.trim();
  const description = document.getElementById("hw-desc").value.trim();
  if (!title) return;
  const items = pStoreGet("homework");
  items.unshift({ id: pUid(), title: title, dueDate: dueDate, description: description, completed: false });
  pStoreSet("homework", items);
  document.getElementById("homework-form").reset();
  renderAdminHomework();
});

function renderAdminHomework() {
  const list = document.getElementById("admin-homework-list");
  const items = pStoreGet("homework");
  if (!items.length) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (hw) {
    const el = document.createElement("div");
    el.className = "entry" + (hw.completed ? " done" : "");
    el.innerHTML =
      '<div class="entry-title">' + esc(hw.title) + (hw.completed ? " — done" : "") + "</div>" +
      '<div class="entry-meta">' + (hw.dueDate ? "Due " + esc(hw.dueDate) : "") + "</div>" +
      '<div class="entry-body">' + esc(hw.description || "") + "</div>" +
      '<div class="entry-actions"><button class="btn btn-secondary del-hw" data-id="' + hw.id + '">Delete</button></div>';
    list.appendChild(el);
  });
  list.querySelectorAll(".del-hw").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let items = pStoreGet("homework");
      items = items.filter(function (h) { return h.id !== btn.getAttribute("data-id"); });
      pStoreSet("homework", items);
      renderAdminHomework();
    });
  });
}

/* ---------------- Session notes ---------------- */
document.getElementById("note-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();
  if (!title) return;
  const items = pStoreGet("notes");
  items.unshift({ id: pUid(), title: title, content: content, createdAt: new Date().toLocaleDateString() });
  pStoreSet("notes", items);
  document.getElementById("note-form").reset();
  renderAdminNotes();
});

function renderAdminNotes() {
  const list = document.getElementById("admin-notes-list");
  const items = pStoreGet("notes");
  if (!items.length) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (note) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      '<div class="entry-title">' + esc(note.title) + "</div>" +
      '<div class="entry-body">' + esc(note.content || "") + "</div>" +
      '<div class="entry-actions"><button class="btn btn-secondary del-note" data-id="' + note.id + '">Delete</button></div>';
    list.appendChild(el);
  });
  list.querySelectorAll(".del-note").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let items = pStoreGet("notes");
      items = items.filter(function (n) { return n.id !== btn.getAttribute("data-id"); });
      pStoreSet("notes", items);
      renderAdminNotes();
    });
  });
}

/* ---------------- Videos ---------------- */
document.getElementById("video-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("vid-title").value.trim();
  const url = document.getElementById("vid-url").value.trim();
  const description = document.getElementById("vid-desc").value.trim();
  if (!title || !url) return;
  const items = pStoreGet("videos");
  items.push({ id: pUid(), title: title, url: url, description: description });
  pStoreSet("videos", items);
  document.getElementById("video-form").reset();
  renderAdminVideos();
});

function renderAdminVideos() {
  const list = document.getElementById("admin-video-list");
  const items = pStoreGet("videos");
  if (!items.length) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (v) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      '<div class="entry-title">' + esc(v.title) + "</div>" +
      '<div class="entry-meta">' + esc(v.url) + "</div>" +
      '<div class="entry-actions"><button class="btn btn-secondary del-vid" data-id="' + v.id + '">Delete</button></div>';
    list.appendChild(el);
  });
  list.querySelectorAll(".del-vid").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let items = pStoreGet("videos");
      items = items.filter(function (v) { return v.id !== btn.getAttribute("data-id"); });
      pStoreSet("videos", items);
      renderAdminVideos();
    });
  });
}

/* ---------------- Prayers ---------------- */
document.getElementById("prayer-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("pr-title").value.trim();
  const category = document.getElementById("pr-category").value.trim();
  const text = document.getElementById("pr-text").value.trim();
  if (!title || !text) return;
  const items = pStoreGet("prayers");
  items.push({ id: pUid(), title: title, category: category, text: text });
  pStoreSet("prayers", items);
  document.getElementById("prayer-form").reset();
  renderAdminPrayers();
});

function renderAdminPrayers() {
  const list = document.getElementById("admin-prayer-list");
  const items = pStoreGet("prayers");
  if (!items.length) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (p) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      (p.category ? '<div class="tag">' + esc(p.category) + "</div>" : "") +
      '<div class="entry-title">' + esc(p.title) + "</div>" +
      '<div class="entry-actions"><button class="btn btn-secondary del-pr" data-id="' + p.id + '">Delete</button></div>';
    list.appendChild(el);
  });
  list.querySelectorAll(".del-pr").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let items = pStoreGet("prayers");
      items = items.filter(function (p) { return p.id !== btn.getAttribute("data-id"); });
      pStoreSet("prayers", items);
      renderAdminPrayers();
    });
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

renderAdminHomework();
renderAdminNotes();
renderAdminVideos();
renderAdminPrayers();
