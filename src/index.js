import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
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

document.querySelectorAll("#admin").forEach((item) => {
  item.style.display = "none";
});

let user = JSON.parse(localStorage.getItem("loggedInUserId"));

if (user) {
  document.querySelector(".login").textContent = "Logout";
  document.querySelector("#admin.lg-bag").style.display = "block";
  if (user.role == "admin") {
    document.querySelectorAll("#admin").forEach((item) => {
      item.style.display = "block";
    });
  } else {
    document.querySelectorAll("#admin").forEach((item) => {
      item.style.display = "none";
    });
    document.querySelector("#admin.lg-bag").style.display = "block";
  }
}

async function getAllProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const product = docSnap.data();
    document.querySelector(".pro-container").innerHTML += `
    <div class="pro">
      <img src=${product.Image} alt="" />
      <div class="des">
        <span>${product.Category}</span>
        <h5>${product.Name}</h5>
        <div class="star">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
        </div>
        <h4>$${product.Price}</h4>
      </div>
      <a href="#"><i class="fa-solid fa-cart-shopping"></i></a>
    </div>
        `;
  });
}

getAllProducts();
