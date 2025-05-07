// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDzqContWUD3tFfuxzMY_eMjbiJCV4vtJY",
    authDomain: "thuyettrinh-7ac73.firebaseapp.com",
    projectId: "thuyettrinh-7ac73",
    storageBucket: "thuyettrinh-7ac73.firebasestorage.app",
    messagingSenderId: "276448181941",
    appId: "1:276448181941:web:6da2911e1b5172d9ecc8fc",
    measurementId: "G-F4VTP20NG8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
