/* ============================================
   Practice Portal data store.
   Everything here lives in the browser's localStorage —
   nothing touches Firebase or your real client data.
   Safe to break. Use "Reset practice data" in the admin
   view to start over any time.
   ============================================ */

const SEED_DATA = {
  homework: [
    {
      id: "hw1",
      title: "Write your 3 core offers",
      dueDate: "Sept 20",
      description: "List the three ways clients currently pay you, in plain language a stranger would understand.",
      completed: false
    },
    {
      id: "hw2",
      title: "Journal: What does 'success' mean to you?",
      dueDate: "",
      description: "10 minutes, no editing. Just get it out of your head and onto paper.",
      completed: true
    }
  ],
  notes: [
    {
      id: "note1",
      title: "Session 1 — Getting oriented",
      content: "Talked through her current offers and where she feels stretched thin. Homework: define the 3 core offers.",
      createdAt: "2026-08-20"
    }
  ],
  videos: [
    {
      id: "vid1",
      title: "Sample training video (replace with your own)",
      url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      description: "This is a placeholder so you can see how the video embed looks. Delete it and add your own from the Admin tab."
    }
  ],
  prayers: [
    {
      id: "pr1",
      title: "Memorare",
      category: "Discernment",
      text:
        "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to your protection, " +
        "implored your help, or sought your intercession was left unaided.\n\n" +
        "Inspired by this confidence, I fly unto you, O Virgin of virgins, my Mother. To you do I come, " +
        "before you I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, " +
        "but in your mercy hear and answer me. Amen."
    }
  ]
};

function pStoreGet(key) {
  const raw = localStorage.getItem("practice_" + key);
  if (raw === null) {
    localStorage.setItem("practice_" + key, JSON.stringify(SEED_DATA[key]));
    return JSON.parse(JSON.stringify(SEED_DATA[key]));
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return SEED_DATA[key];
  }
}

function pStoreSet(key, value) {
  localStorage.setItem("practice_" + key, JSON.stringify(value));
}

function pStoreResetAll() {
  ["homework", "notes", "videos", "prayers"].forEach(function (key) {
    localStorage.removeItem("practice_" + key);
  });
}

function pUid() {
  return "id" + Date.now() + Math.floor(Math.random() * 1000);
}
