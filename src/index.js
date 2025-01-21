import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
  // Put your config here
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

await getAllProducts();

let user = JSON.parse(localStorage.getItem("loggedInUserId"));

async function getProduct(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

async function getAllProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const product = docSnap.data();
    document.querySelectorAll(".pro-container").forEach((item) => {
      item.innerHTML += `
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
      <span><i id="addtocart" data-id=${docSnap.id} class="fa-solid fa-cart-shopping"></i></span>
    </div>
        `;
    });
  });
}

async function addToCart(product) {
  try {
    await setDoc(doc(db, "carts", generateSecureRandomString(28)), {
      userId: user.id,
      userName: `${user.fname} ${user.lname}`,
      product: product.Name,
      image: product.Image,
      price: product.Price,
      quantity: 1,
      date: new Date().toISOString(),
      status: "Pending",
    });
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

document.querySelectorAll("#addtocart").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const product = await getProduct(id);
    await addToCart(product);
    toastr.success(
      "Great choice! Your item has been added to the cart. 🎉",
      "Success"
    );
  });
});

function generateSecureRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(array, (byte) =>
    characters.charAt(byte % characters.length)
  ).join("");
}
