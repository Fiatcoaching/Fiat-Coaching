/* ============================================
   ALL YOUR REAL DATA LIVES HERE.
   To add a client, add homework, add a session note, add a
   training video, or add a prayer — edit this file, save, and
   commit the change on GitHub. No other setup needed.

   IMPORTANT: this file is plain text inside a public repo, so
   don't put anything here you wouldn't want a stranger to
   possibly see (see the note in README.md about privacy).
   ============================================ */

/* Username → password. Keep usernames lowercase, no spaces. */
const CLIENTS = {
  'cassandra': 'fiat2026',
  'mary': 'changeme1',
  // add more clients here: 'username': 'password',
};

/* Username → their homework, notes, and display name.
   Every key here must exactly match a username above. */
const CLIENT_CONTENT = {
  'cassandra': {
    name: "Cassandra",
    homework: [],
    sessionNotes: []
  },
  'mary': {
    name: "Mary Smith",
    homework: [
      {
        title: "Write your 3 core offers",
        dueDate: "Sept 20",
        description: "List the three ways clients currently pay you, in plain language a stranger would understand.",
        completed: false
      }
    ],
    sessionNotes: [
      {
        title: "Session 1 — Getting oriented",
        date: "Sept 3, 2026",
        content: "Talked through her current offers and where she feels stretched thin. Homework: define the 3 core offers."
      }
    ]
  }
  // Copy the block above (from "mary": { down to its matching })
  // to add another client's content, using their username as the key.
};

/* Shared with every client — no per-client copy needed. */
const TRAINING_VIDEOS = [
  {
    title: "Sample training video (replace with your own)",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description: "This is a placeholder so you can see how the video embed looks. Replace or delete it."
  }
];

const PRAYERS = [
  {
    title: "Memorare",
    category: "Discernment",
    text:
      "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to your protection, " +
      "implored your help, or sought your intercession was left unaided.\n\n" +
      "Inspired by this confidence, I fly unto you, O Virgin of virgins, my Mother. To you do I come, " +
      "before you I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, " +
      "but in your mercy hear and answer me. Amen."
  }
];
