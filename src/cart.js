import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
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

let user = JSON.parse(localStorage.getItem("loggedInUserId"));
await getProductsFromCart(user.id);

async function getProductsFromCart(userId) {
  try {
    const cartsRef = collection(db, "carts");
    const q = query(cartsRef, where("userId", "==", userId));
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
                  <span>$${product.price}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >${product.quantity}</span
                >
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >$${product.quantity * product.price}</span
                >
              </td>
              <td class="py-3 px-6 text-center">
              ${
                product.status == "Pending"
                  ? `<span class="py-2 px-3 rounded-full bg-gray-500 text-white">${product.status}</span>`
                  : product.status == "Processing"
                  ? `<span class="py-2 px-3 rounded-full bg-yellow-500 text-white">${product.status}</span>`
                  : product.status == "Confirmed"
                  ? `<span class="py-2 px-3 rounded-full bg-indigo-500 text-white">${product.status}</span>`
                  : product.status == "Canceled"
                  ? `<span class="py-2 px-3 rounded-full bg-red-600 text-white">${product.status}</span>`
                  : product.status == "Delivered"
                  ? `<span class="py-2 px-3 rounded-full bg-green-500 text-white">${product.status}</span>`
                  : ""
              }
              </td>
              ${
                product.status == "Pending"
                  ? `<td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-around">
                      <i  id="process" data-id=${docSnap.id} class="fa-solid fa-truck-fast text-[30px] duration-200 hover:text-blue-700 hover:cursor-pointer"></i>
                      <i id="edit-product" data-id=${docSnap.id} class="fa-solid fa-pen-to-square text-[30px] duration-200 hover:text-indigo-700 hover:cursor-pointer"></i>
                      <i id="delete-product" data-id=${docSnap.id} class="fa-solid fa-trash text-[30px] duration-200 hover:text-red-600 hover:cursor-pointer"></i>
                    </div>
                  </td>`
                  : product.status == "Processing"
                  ? `<td class="py-3 px-6 text-center"><i class="fa-solid fa-stopwatch text-[30px] text-yellow-500"></i></td>`
                  : product.status == "Confirmed"
                  ? `<td class="py-3 px-6 text-center" ><i id="checkout" data-id=${docSnap.id} class="fa-solid fa-credit-card text-[30px] duration-200 hover:text-indigo-700 hover:cursor-pointer"></i></td>`
                  : product.status == "Delivered"
                  ? `<td class="py-3 px-6 text-center" ><i class="fa-solid fa-check text-[30px] text-green-500"></i></td>`
                  : `<td class="py-3 px-6 text-center" ><i class="fa-solid fa-x text-[30px] text-red-600"></i></td>`
              }
            </tr>
        `;
      });
    }
  } catch (error) {
    console.error("Error retrieving cart:", error);
  }
}

async function getProduct(id) {
  const docRef = doc(db, "carts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

document.querySelectorAll("#checkout").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const product = await getProduct(id);
    const newProduct = {
      status: "Delivered",
    };
    await updateProduct(id, newProduct);
    const stripe = Stripe("");
    stripe
      .redirectToCheckout({
        lineItems: [
          {
            price: "",
            quantity: parseInt(product.quantity),
          },
        ],
        mode: "payment",
        successUrl: "http://127.0.0.1:5500/src/cart.html",
        cancelUrl: "http://127.0.0.1:5500/src/cart.html",
      })
      .then(function (response) {
        alert(response);
      });
  });
});

document.querySelectorAll("#process").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const newProduct = {
      status: "Processing",
    };
    await updateProduct(id, newProduct);
    window.location.reload();
  });
});

const newQuantity = document.getElementById("edit-quantity");

document.querySelectorAll("#edit-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const product = await getProduct(id);
    newQuantity.value = product.quantity;
    document.getElementById("edit-modal").classList.remove("hidden");
    document.getElementById("edit").addEventListener("click", async () => {
      const newProduct = {
        quantity: newQuantity.value,
      };
      await updateProduct(id, newProduct);
      document.getElementById("edit-modal").classList.add("hidden");
      window.location.reload();
    });
  });
});

async function updateProduct(id, newProduct) {
  const docRef = doc(db, "carts", id);
  try {
    await updateDoc(docRef, newProduct);
    console.log("Document successfully updated!");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

document.querySelectorAll("#delete-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "px-[15px] py-[10px] ml-3 bg-green-600 text-white outline-none rounded-lg",
        cancelButton:
          "px-[15px] py-[10px] bg-red-600 text-white outline-none rounded-lg",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your order has been deleted.",
            icon: "success",
          });
          await deleteProduct(id);
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your order is safe :)",
            icon: "error",
          });
        }
      });
  });
});

async function deleteProduct(id) {
  const docRef = doc(db, "carts", id);

  try {
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

document.getElementById("edit-cancel").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
});
