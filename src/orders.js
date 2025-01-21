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
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
  // Put your config here
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.querySelectorAll("#admin").forEach((item) => {
  item.style.display = "none";
});

let user = JSON.parse(localStorage.getItem("loggedInUserId"));

await getAllOrders();

async function getAllOrders() {
  const cartsRef = collection(db, "carts");
  const q = query(cartsRef, where("status", "==", "Processing"));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.docs.forEach((docSnap) => {
      const product = docSnap.data();
      document.querySelector(".products").innerHTML += `
    <tr class="border-b border-[#088178] hover:bg-gray-100">
              <td class="py-3 px-6 text-left whitespace-nowrap">
                <div class="flex items-center">
                  <img class="w-[60px]" src=${product.image} alt="">
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${product.product}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${product.userName}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >${product.quantity}</span
                >
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-around">
                  <i id="confirm-product" data-id=${docSnap.id} class="fa-solid fa-check text-[30px] duration-200 hover:text-green-500 hover:cursor-pointer"></i>
                  <i id="cansle-product" data-id=${docSnap.id} class="fa-solid fa-x text-[30px] duration-200 hover:text-red-600 hover:cursor-pointer"></i>
                </div>
              </td>
            </tr>
        `;
    });
  }
}

document.querySelectorAll("#confirm-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    await updateDoc(doc(db, "carts", id), { status: "Confirmed" });
    window.location.reload();
  });
});
document.querySelectorAll("#cansle-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    await updateDoc(doc(db, "carts", id), { status: "Canceled" });
    window.location.reload();
  });
});
