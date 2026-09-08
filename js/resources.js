requireAuth(function (user, userData) {
  document.getElementById("sidebar-name").textContent = userData.name || user.email;
  loadVideos();
});

wireLogout("logout-btn");

function toEmbedUrl(url) {
  // Supports plain YouTube and Vimeo links, converts to embeddable form.
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return "https://www.youtube.com/embed/" + u.pathname.slice(1);
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return "https://www.youtube.com/embed/" + id;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return "https://player.vimeo.com/video/" + id;
    }
    return url; // fall back to whatever was stored
  } catch (e) {
    return url;
  }
}

function loadVideos() {
  const list = document.getElementById("video-list");
  db.collection("trainingVideos").orderBy("order", "asc").get()
    .then(function (snap) {
      if (snap.empty) {
        list.innerHTML = '<div class="empty-state">No training videos posted yet — check back soon.</div>';
        return;
      }
      list.innerHTML = "";
      snap.forEach(function (doc) {
        const v = doc.data();
        const wrap = document.createElement("div");
        wrap.className = "entry";
        wrap.innerHTML =
          '<div class="entry-title">' + escapeHtmlR(v.title) + "</div>" +
          '<div class="entry-body" style="margin-bottom:0.8em;">' + escapeHtmlR(v.description || "") + "</div>" +
          '<div class="video-embed"><iframe src="' + toEmbedUrl(v.url) +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
        list.appendChild(wrap);
      });
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<div class="empty-state">Couldn\'t load videos right now.</div>';
    });
}

function escapeHtmlR(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
