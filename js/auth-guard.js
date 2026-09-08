/* ============================================
   Shared auth guard.
   Call requireAuth(callback) on every protected page.
   callback receives (firebaseUser, userDoc) once we know
   the person is logged in and we've loaded their profile.
   ============================================ */
function requireAuth(callback, opts) {
  opts = opts || {};
  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    try {
      const snap = await db.collection("users").doc(user.uid).get();
      if (!snap.exists) {
        // Logged in with Firebase Auth but no profile doc yet.
        // This can happen right after an admin creates an account
        // in the Firebase Console before adding the matching
        // Firestore doc — see README "Adding a new client".
        document.body.innerHTML =
          '<div style="padding:3rem;font-family:sans-serif;">' +
          "Your account isn't fully set up yet. Please check back " +
          "shortly, or contact Cassandra." +
          "</div>";
        return;
      }
      const userData = snap.data();
      if (opts.requireAdmin && userData.role !== "admin") {
        window.location.href = "dashboard.html";
        return;
      }
      callback(user, userData);
    } catch (err) {
      console.error("Auth guard error:", err);
    }
  });
}

function wireLogout(buttonId) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener("click", function () {
      auth.signOut().then(function () {
        window.location.href = "index.html";
      });
    });
  }
}
