let selectedClientId = null;

requireAuth(function (user, userData) {
  document.getElementById("sidebar-name").textContent = userData.name || user.email;
  loadClientOptions();
  loadAdminVideos();
  loadAdminPrayers();
}, { requireAdmin: true });

wireLogout("logout-btn");

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

/* ---------------- Client selector ---------------- */
function loadClientOptions() {
  const select = document.getElementById("client-select");
  db.collection("users").where("role", "==", "client").get()
    .then(function (snap) {
      snap.forEach(function (doc) {
        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = doc.data().name || doc.data().email;
        select.appendChild(opt);
      });
    })
    .catch(function (err) { console.error(err); });
}

document.getElementById("client-select").addEventListener("change", function () {
  selectedClientId = this.value || null;
  document.getElementById("client-panels").style.display = selectedClientId ? "block" : "none";
  if (selectedClientId) {
    loadAdminHomework();
    loadAdminNotes();
  }
});

/* ---------------- Homework ---------------- */
document.getElementById("homework-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!selectedClientId) return;
  const title = document.getElementById("hw-title").value.trim();
  const dueDate = document.getElementById("hw-due").value.trim();
  const description = document.getElementById("hw-desc").value.trim();
  if (!title) return;

  db.collection("users").doc(selectedClientId).collection("homework").add({
    title: title,
    dueDate: dueDate,
    description: description,
    completed: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    document.getElementById("homework-form").reset();
    loadAdminHomework();
  }).catch(function (err) { console.error(err); alert("Couldn't save homework — try again."); });
});

function loadAdminHomework() {
  const list = document.getElementById("admin-homework-list");
  list.innerHTML = "Loading…";
  db.collection("users").doc(selectedClientId).collection("homework")
    .orderBy("createdAt", "desc").get()
    .then(function (snap) {
      if (snap.empty) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const hw = doc.data();
        const el = document.createElement("div");
        el.className = "entry" + (hw.completed ? " done" : "");
        el.innerHTML =
          '<div class="entry-title">' + esc(hw.title) + (hw.completed ? " — done" : "") + "</div>" +
          '<div class="entry-meta">' + (hw.dueDate ? "Due " + esc(hw.dueDate) : "") + "</div>" +
          '<div class="entry-body">' + esc(hw.description || "") + "</div>" +
          '<div class="entry-actions"><button class="btn btn-secondary del-hw" data-id="' + doc.id + '">Delete</button></div>';
        list.appendChild(el);
      });
      list.querySelectorAll(".del-hw").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("Delete this homework item?")) return;
          db.collection("users").doc(selectedClientId).collection("homework").doc(btn.getAttribute("data-id")).delete()
            .then(loadAdminHomework);
        });
      });
    });
}

/* ---------------- Session notes ---------------- */
document.getElementById("note-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!selectedClientId) return;
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();
  if (!title) return;

  db.collection("users").doc(selectedClientId).collection("sessionNotes").add({
    title: title,
    content: content,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function () {
    document.getElementById("note-form").reset();
    loadAdminNotes();
  }).catch(function (err) { console.error(err); alert("Couldn't save note — try again."); });
});

function loadAdminNotes() {
  const list = document.getElementById("admin-notes-list");
  list.innerHTML = "Loading…";
  db.collection("users").doc(selectedClientId).collection("sessionNotes")
    .orderBy("createdAt", "desc").get()
    .then(function (snap) {
      if (snap.empty) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const note = doc.data();
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML =
          '<div class="entry-title">' + esc(note.title) + "</div>" +
          '<div class="entry-body">' + esc(note.content || "") + "</div>" +
          '<div class="entry-actions"><button class="btn btn-secondary del-note" data-id="' + doc.id + '">Delete</button></div>';
        list.appendChild(el);
      });
      list.querySelectorAll(".del-note").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("Delete this session note?")) return;
          db.collection("users").doc(selectedClientId).collection("sessionNotes").doc(btn.getAttribute("data-id")).delete()
            .then(loadAdminNotes);
        });
      });
    });
}

/* ---------------- Training videos ---------------- */
document.getElementById("video-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("vid-title").value.trim();
  const url = document.getElementById("vid-url").value.trim();
  const description = document.getElementById("vid-desc").value.trim();
  if (!title || !url) return;

  db.collection("trainingVideos").add({
    title: title,
    url: url,
    description: description,
    order: Date.now()
  }).then(function () {
    document.getElementById("video-form").reset();
    loadAdminVideos();
  }).catch(function (err) { console.error(err); alert("Couldn't save video — try again."); });
});

function loadAdminVideos() {
  const list = document.getElementById("admin-video-list");
  db.collection("trainingVideos").orderBy("order", "asc").get()
    .then(function (snap) {
      if (snap.empty) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const v = doc.data();
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML =
          '<div class="entry-title">' + esc(v.title) + "</div>" +
          '<div class="entry-meta">' + esc(v.url) + "</div>" +
          '<div class="entry-actions"><button class="btn btn-secondary del-vid" data-id="' + doc.id + '">Delete</button></div>';
        list.appendChild(el);
      });
      list.querySelectorAll(".del-vid").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("Delete this video?")) return;
          db.collection("trainingVideos").doc(btn.getAttribute("data-id")).delete().then(loadAdminVideos);
        });
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

  db.collection("prayers").add({
    title: title,
    category: category,
    text: text,
    order: Date.now()
  }).then(function () {
    document.getElementById("prayer-form").reset();
    loadAdminPrayers();
  }).catch(function (err) { console.error(err); alert("Couldn't save prayer — try again."); });
});

function loadAdminPrayers() {
  const list = document.getElementById("admin-prayer-list");
  db.collection("prayers").orderBy("order", "asc").get()
    .then(function (snap) {
      if (snap.empty) { list.innerHTML = '<div class="empty-state">None yet.</div>'; return; }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const p = doc.data();
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML =
          (p.category ? '<div class="tag">' + esc(p.category) + "</div>" : "") +
          '<div class="entry-title">' + esc(p.title) + "</div>" +
          '<div class="entry-actions"><button class="btn btn-secondary del-pr" data-id="' + doc.id + '">Delete</button></div>';
        list.appendChild(el);
      });
      list.querySelectorAll(".del-pr").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("Delete this prayer?")) return;
          db.collection("prayers").doc(btn.getAttribute("data-id")).delete().then(loadAdminPrayers);
        });
      });
    });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
