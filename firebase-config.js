// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5i4q1lC08UB0JqUHc4_3lfplUhQRibDY",
    authDomain: "web-reactivo.firebaseapp.com",
    projectId: "web-reactivo",
    storageBucket: "web-reactivo.firebasestorage.app",
    messagingSenderId: "607942032615",
    appId: "1:607942032615:web:beaf74951e26742ef17642"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
