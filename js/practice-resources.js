renderVideos();

function toEmbedUrlPr(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return "https://www.youtube.com/embed/" + u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return "https://www.youtube.com/embed/" + id;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return "https://player.vimeo.com/video/" + id;
    }
    return url;
  } catch (e) {
    return url;
  }
}

function renderVideos() {
  const list = document.getElementById("video-list");
  const items = pStoreGet("videos");
  if (!items.length) { list.innerHTML = '<div class="empty-state">No training videos posted yet.</div>'; return; }
  list.innerHTML = "";
  items.forEach(function (v) {
    const el = document.createElement("div");
    el.className = "entry";
    el.innerHTML =
      '<div class="entry-title">' + esc(v.title) + "</div>" +
      '<div class="entry-body" style="margin-bottom:0.8em;">' + esc(v.description || "") + "</div>" +
      '<div class="video-embed"><iframe src="' + toEmbedUrlPr(v.url) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    list.appendChild(el);
  });
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}
