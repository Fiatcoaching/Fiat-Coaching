/* ============================================
   FIREBASE SETUP — paste your project's config below.
   Get this from: Firebase Console > Project Settings >
   General tab > "Your apps" > SDK setup and configuration.
   See README.md for the full step-by-step.
   ============================================ */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
