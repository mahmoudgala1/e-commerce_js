import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD1Rl4TnkTZpYg1dyRgSQ6LlXOTaDeIfDA",
  authDomain: "e-commerce-a7786.firebaseapp.com",
  projectId: "e-commerce-a7786",
  storageBucket: "e-commerce-a7786.appspot.com",
  messagingSenderId: "243196859986",
  appId: "1:243196859986:web:668eb127d662ebea8db18b",
  measurementId: "G-8F995YFR3Y",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

bar.addEventListener("click", () => {
  nav.style.right = 0;
});

close.addEventListener("click", () => {
  nav.style.right = "-300px";
});

document.querySelector(".login").addEventListener("click", () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    localStorage.removeItem("loggedInUserId");
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Error Signing out:", error);
      });
  } else {
    window.location.href = "login.html";
  }
});
