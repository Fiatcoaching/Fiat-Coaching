requireAuth(function (user, userData) {
  document.getElementById("sidebar-name").textContent = userData.name || user.email;
  document.getElementById("welcome-heading").textContent =
    "Welcome, " + (userData.name ? userData.name.split(" ")[0] : "friend");

  loadHomework(user.uid);
  loadNotes(user.uid);
});

wireLogout("logout-btn");

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function loadHomework(uid) {
  const list = document.getElementById("homework-list");
  db.collection("users").doc(uid).collection("homework")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (snap) {
      if (snap.empty) {
        list.innerHTML = '<div class="empty-state">No homework assigned yet.</div>';
        return;
      }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const hw = doc.data();
        const el = document.createElement("div");
        el.className = "entry" + (hw.completed ? " done" : "");
        el.innerHTML =
          '<div class="entry-title">' + escapeHtml(hw.title) + "</div>" +
          '<div class="entry-meta">' + (hw.dueDate ? "Due " + escapeHtml(hw.dueDate) : "No due date") + "</div>" +
          '<div class="entry-body">' + escapeHtml(hw.description || "") + "</div>" +
          '<div class="entry-actions">' +
          '<button class="btn btn-secondary toggle-btn" data-id="' + doc.id + '" data-done="' + !!hw.completed + '">' +
          (hw.completed ? "Mark not done" : "Mark done") +
          "</button></div>";
        list.appendChild(el);
      });

      list.querySelectorAll(".toggle-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const id = btn.getAttribute("data-id");
          const done = btn.getAttribute("data-done") === "true";
          db.collection("users").doc(uid).collection("homework").doc(id)
            .update({ completed: !done })
            .then(function () { loadHomework(uid); });
        });
      });
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<div class="empty-state">Couldn\'t load homework right now.</div>';
    });
}

function loadNotes(uid) {
  const list = document.getElementById("notes-list");
  db.collection("users").doc(uid).collection("sessionNotes")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (snap) {
      if (snap.empty) {
        list.innerHTML = '<div class="empty-state">No session notes yet.</div>';
        return;
      }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const note = doc.data();
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML =
          '<div class="entry-title">' + escapeHtml(note.title) + "</div>" +
          '<div class="entry-meta">' + formatDate(note.createdAt) + "</div>" +
          '<div class="entry-body">' + escapeHtml(note.content || "") + "</div>";
        list.appendChild(el);
      });
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<div class="empty-state">Couldn\'t load session notes right now.</div>';
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
