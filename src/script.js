import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
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

const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

bar.addEventListener("click", () => {
  nav.style.right = 0;
});

close.addEventListener("click", () => {
  nav.style.right = "-300px";
});

document.querySelectorAll("#admin").forEach((item) => {
  item.style.display = "none";
});

let user = JSON.parse(localStorage.getItem("loggedInUserId"));

if (user) {
  document.querySelector(".login").textContent = "Logout";
  document.querySelector("#admin.lg-bag").style.display = "block";
  document.getElementById(
    "profile"
  ).innerHTML = `<img class="w-[60px] rounded-full" src=${user.image} alt=""> ${user.fname} ${user.lname}`;
  if (user.role == "admin") {
    document.querySelectorAll("#admin").forEach((item) => {
      item.style.display = "block";
    });
  } else {
    if (
      window.location.href == window.location.origin + "/src/products.html" ||
      window.location.href == window.location.origin + "/src/users.html" ||
      window.location.href == window.location.origin + "/src/orders.html"
    ) {
      window.location.href = "index.html";
    }
    document.querySelectorAll("#admin").forEach((item) => {
      item.style.display = "none";
    });
    document.querySelector("#admin.lg-bag").style.display = "block";
  }
} else {
  window.location.href = "login.html";
}

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
