// /assets/js/firebase-init.js
(function() {
  // Firebase configuration (replace with your actual config)
  const firebaseConfig = {
  apiKey: "AIzaSyDu-fv_g23S_yhuQ8guetrc5L3vntDo_YY",
  authDomain: "clap-counts.firebaseapp.com",
  projectId: "clap-counts",
  storageBucket: "clap-counts.firebasestorage.app",
  messagingSenderId: "20728882575",
  appId: "1:20728882575:web:e68d248a9bb370e70c17fa",
  measurementId: "G-MY28C8J1QK"
  };


  // Load Firebase only if not already loaded
  if (!window.firebase) {
    console.error('Firebase not loaded. Check script includes.');
    return;
  }

  // Initialize Firebase
  const app = window.firebase.initializeApp(firebaseConfig);
  window.db = window.firebase.firestore(app); // Expose db globally
  window.auth = window.firebase.auth(app); // Expose auth for debugging

  // Anonymous sign-in with error handling
  window.auth.signInAnonymously()
    .then(() => console.log('Anonymous sign-in successful'))
    .catch((error) => console.error('Anonymous sign-in failed:', error));

  // Log to confirm db is set
  console.log('Firestore db initialized:', window.db);
})();