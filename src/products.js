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

await getAllProducts();

const productName = document.getElementById("product-name");
const productCategory = document.getElementById("product-category");
const productImage = document.getElementById("product-image");
const productPrice = document.getElementById("product-price");
const productStock = document.getElementById("product-stock");

const newProductName = document.getElementById("edit-product-name");
const newProductCategory = document.getElementById("edit-product-category");
const newProductImage = document.getElementById("edit-product-image");
const newProductPrice = document.getElementById("edit-product-price");
const newProductStock = document.getElementById("edit-product-stock");

function clearInputData() {
  productName.value = "";
  productCategory.value = "";
  productImage.value = "";
  productPrice.value = "";
  productStock.value = "";
}

async function addData(product) {
  try {
    await setDoc(doc(db, "products", generateSecureRandomString(28)), {
      Name: product.Name,
      Image: product.Image,
      Category: product.Category,
      Price: product.Price,
      "Stock Quantity": product["Stock Quantity"],
    });
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

document.getElementById("add-product").addEventListener("click", () => {
  document.getElementById("add-modal").classList.remove("hidden");
});

document.getElementById("add").addEventListener("click", async () => {
  const errors = inputValidationsForAdd({
    productName,
    productCategory,
    productPrice,
    productImage,
    productStock,
  });
  if (Object.values(errors).some((error) => error.value !== "")) {
    showErrorMessageForAdd(errors);
    return;
  }
  const product = {
    Name: productName.value,
    Image: productImage.value,
    Category: productCategory.value,
    Price: parseFloat(productPrice.value),
    "Stock Quantity": parseInt(productStock.value),
  };
  toastr.success("Great Product Added Successfully 🎉", "Success");
  await addData(product);
  clearInputData();
  document.getElementById("add-modal").classList.add("hidden");
  window.location.reload();
});

document.getElementById("add-cancel").addEventListener("click", () => {
  clearInputData();
  document.getElementById("add-modal").classList.add("hidden");
  productName.parentElement.nextElementSibling.textContent = "";
  productCategory.parentElement.nextElementSibling.textContent = "";
  productImage.parentElement.nextElementSibling.textContent = "";
  productPrice.parentElement.nextElementSibling.textContent = "";
  productStock.parentElement.nextElementSibling.textContent = "";
});

document.getElementById("edit-cancel").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
  newProductName.parentElement.nextElementSibling.textContent = "";
  newProductCategory.parentElement.nextElementSibling.textContent = "";
  newProductImage.parentElement.nextElementSibling.textContent = "";
  newProductPrice.parentElement.nextElementSibling.textContent = "";
  newProductStock.parentElement.nextElementSibling.textContent = "";
});

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
    document.querySelector(".products").innerHTML += `
    <tr class="border-b border-[#088178] hover:bg-gray-100">
              <td class="py-3 px-6 text-left whitespace-nowrap">
                <div class="flex items-center">
                  <img class="w-[60px]" src=${product.Image} alt="">
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${product.Name}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                  <span>${product.Category}</span>
                </div>
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >$${product.Price}</span
                >
              </td>
              <td class="py-3 px-6 text-center">
                <span
                  class="py-1 px-3 rounded-full"
                  >${product["Stock Quantity"]}</span
                >
              </td>
              <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-around">
                  <i id="edit-product" data-id=${docSnap.id} class="fa-solid fa-pen-to-square text-[30px] duration-200 hover:text-indigo-700 hover:cursor-pointer"></i>
                  <i id="delete-product" data-id=${docSnap.id} class="fa-solid fa-trash text-[30px] duration-200 hover:text-red-600 hover:cursor-pointer"></i>
                </div>
              </td>
            </tr>
        `;
  });
}

document.querySelectorAll("#edit-product").forEach((item) => {
  item.addEventListener("click", async () => {
    const id = item.getAttribute("data-id");
    const product = await getProduct(id);
    newProductName.value = product.Name;
    newProductCategory.value = product.Category;
    newProductImage.value = product.Image;
    newProductPrice.value = product.Price;
    newProductStock.value = product["Stock Quantity"];
    document.getElementById("edit-modal").classList.remove("hidden");
    document.getElementById("edit").addEventListener("click", async () => {
      const errors = inputValidationsForEdit({
        newProductName,
        newProductCategory,
        newProductImage,
        newProductPrice,
        newProductStock,
      });
      if (Object.values(errors).some((error) => error.value !== "")) {
        showErrorMessageForEdit(errors);
        return;
      }
      const product = {
        Name: newProductName.value,
        Image: newProductImage.value,
        Category: newProductCategory.value,
        Price: parseFloat(newProductPrice.value),
        "Stock Quantity": parseInt(newProductStock.value),
      };
      toastr.success("Great Product Updated Successfully 🎉", "Success");
      await updateProduct(id, product);
      document.getElementById("edit-modal").classList.add("hidden");
      window.location.reload();
    });
  });
});

async function updateProduct(id, newProduct) {
  const docRef = doc(db, "products", id);
  try {
    await updateDoc(docRef, {
      Name: newProduct.Name,
      Image: newProduct.Image,
      Category: newProduct.Category,
      Price: newProduct.Price,
      "Stock Quantity": newProduct["Stock Quantity"],
    });
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
            text: "Your product has been deleted.",
            icon: "success",
          });
          await deleteProduct(id);
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary product is safe :)",
            icon: "error",
          });
        }
      });
  });
});

async function deleteProduct(id) {
  const docRef = doc(db, "products", id);

  try {
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

function generateSecureRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(array, (byte) =>
    characters.charAt(byte % characters.length)
  ).join("");
}

const inputValidationsForAdd = (inputsData) => {
  const errors = {};
  const {
    productName,
    productCategory,
    productImage,
    productPrice,
    productStock,
  } = inputsData;
  if (productName.value.trim() === "") {
    errors.productName = "This field is required";
  }
  if (productCategory.value.trim() === "") {
    errors.productCategory = "This field is required";
  }
  if (productImage.value.trim() === "") {
    errors.productImage = "This field is required";
  }
  if (productPrice.value.trim() === "") {
    errors.productPrice = "This field is required";
  }
  if (productStock.value.trim() === "") {
    errors.productStock = "This field is required";
  }

  return errors;
};

const showErrorMessageForAdd = (errors) => {
  if (errors.productName) {
    productName.parentElement.nextElementSibling.textContent =
      errors.productName;
  } else {
    productName.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.productCategory) {
    productCategory.parentElement.nextElementSibling.textContent =
      errors.productCategory;
  } else {
    productCategory.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.productImage) {
    productImage.parentElement.nextElementSibling.textContent =
      errors.productImage;
  } else {
    productImage.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.productPrice) {
    productPrice.parentElement.nextElementSibling.textContent =
      errors.productPrice;
  } else {
    productPrice.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.productStock) {
    productStock.parentElement.nextElementSibling.textContent =
      errors.productStock;
  } else {
    productStock.parentElement.nextElementSibling.textContent = "";
  }
};
const inputValidationsForEdit = (inputsData) => {
  const errors = {};
  const {
    newProductName,
    newProductCategory,
    newProductImage,
    newProductPrice,
    newProductStock,
  } = inputsData;
  if (newProductName.value.trim() === "") {
    errors.newProductName = "This field is required";
  }
  if (newProductCategory.value.trim() === "") {
    errors.newProductCategory = "This field is required";
  }
  if (newProductImage.value.trim() === "") {
    errors.newProductImage = "This field is required";
  }
  if (newProductPrice.value.trim() === "") {
    errors.newProductPrice = "This field is required";
  }
  if (newProductStock.value.trim() === "") {
    errors.newProductStock = "This field is required";
  }

  return errors;
};

const showErrorMessageForEdit = (errors) => {
  if (errors.newProductName) {
    newProductName.parentElement.nextElementSibling.textContent =
      errors.newProductName;
  } else {
    newProductName.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.newProductCategory) {
    newProductCategory.parentElement.nextElementSibling.textContent =
      errors.newProductCategory;
  } else {
    newProductCategory.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.newProductImage) {
    newProductImage.parentElement.nextElementSibling.textContent =
      errors.newProductImage;
  } else {
    newProductImage.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.newProductPrice) {
    newProductPrice.parentElement.nextElementSibling.textContent =
      errors.newProductPrice;
  } else {
    newProductPrice.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.newProductStock) {
    newProductStock.parentElement.nextElementSibling.textContent =
      errors.newProductStock;
  } else {
    newProductStock.parentElement.nextElementSibling.textContent = "";
  }
};
