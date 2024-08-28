import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
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

const editProfileBtn = document.getElementById("editProfileBtn");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const formFields = document.querySelectorAll("#profileForm input");

document.querySelector(".name").textContent = user.fname + " " + user.lname;
document.querySelector(".photo").src = user.image ?? "./img/avatar.png";

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const image = document.getElementById("image");

firstName.value = user.fname;
lastName.value = user.lname;
email.value = user.email;
image.value = user.image ?? "./img/avatar.png";

editProfileBtn.addEventListener("click", () => {
  formFields.forEach((field) => (field.disabled = !field.disabled));
  saveChangesBtn.classList.toggle("hidden");
});

saveChangesBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const updatedUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    image: image.value,
  };
  await updateDoc(doc(db, "users", user.id), updatedUser);
  localStorage.setItem(
    "loggedInUserId",
    JSON.stringify({
      id: user.id,
      fname: updatedUser.firstName,
      lname: updatedUser.lastName,
      email: updatedUser.email,
      role: user.role,
      image: updatedUser.image,
    })
  );
  formFields.forEach((field) => (field.disabled = true));
  saveChangesBtn.classList.toggle("hidden");
  window.location.reload();
});
