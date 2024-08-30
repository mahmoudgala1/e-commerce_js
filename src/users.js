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

await getAllUsers();

const newFname = document.getElementById("edit-fname");
const newLname = document.getElementById("edit-lname");
const newEmail = document.getElementById("edit-email");
const newRole = document.getElementById("edit-role");

document.getElementById("edit-cancel").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
});

async function getUser(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

async function getAllUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((docSnap) => {
    const user = docSnap.data();
    document.querySelector(".users").innerHTML += `
    <tr class="border-b border-[#088178] hover:bg-gray-100">
              <td class="py-3 px-6 text-left whitespace-nowrap">
                <div class="flex items-center">
                  <img class="w-[60px]" src=${
                    user.image ?? "./img/avatar.png"
                  } alt="">
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${user.firstName} ${user.lastName}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${user.email}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span class="capitalize">${user.role}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >Active</span
                >
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-around">
                  <i id="edit-product" data-id=${
                    docSnap.id
                  } class="fa-solid fa-pen-to-square text-[30px] duration-200 hover:text-indigo-700 hover:cursor-pointer"></i>
                </div>
              </td>
            </tr>
        `;
  });
}

document.querySelectorAll("#edit-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const user = await getUser(id);
    newFname.value = user.firstName;
    newLname.value = user.lastName;
    newEmail.value = user.email;
    newRole.value = user.role;
    document.getElementById("edit-modal").classList.remove("hidden");
    document.getElementById("edit").addEventListener("click", async () => {
      const user = {
        firstName: newFname.value,
        lastName: newLname.value,
        email: newEmail.value,
        role: newRole.value,
      };
      await updateUser(id, user);
      document.getElementById("edit-modal").classList.add("hidden");
      window.location.reload();
    });
  });
});

async function updateUser(id, newUser) {
  const docRef = doc(db, "users", id);
  try {
    await updateDoc(docRef, newUser);
    console.log("Document successfully updated!");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}
