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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    // const docRef = doc(db, "users", loggedInUserId);
    // getDoc(docRef)
    //   .then((docSnap) => {
    //     if (docSnap.exists()) {
    //       const userData = docSnap.data();
    //       document.getElementById("loggedUserFName").innerText =
    //         userData.firstName;
    //       document.getElementById("loggedUserEmail").innerText =
    //         userData.email + " " + userData.roles;
    //       document.getElementById("loggedUserLName").innerText =
    //         userData.lastName;
    //     } else {
    //       console.log("no document found matching id");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error getting document");
    //   });
  } else {
    console.log("User Id not Found in Local storage");
    window.location.href = "index.html";
  }
});

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});

// async function addData() {
//   try {
//     await setDoc(doc(db, "products", generateSecureRandomString(28)), {
//       Id: 1,
//       Name: "product1",
//       Image: "product1.png",
//       Category: "category1",
//       Price: 500,
//       Description: "vvvvvvvvvery gggood",
//       "Stock Quantity": 500,
//     });
//     console.log("Document successfully written!");
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

// addData();

// async function getDocument() {
//   const docRef = doc(db, "products", "pw7pB3aeBsTW2lp6lnPJq7Jya5XM");
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.id);
//   } else {
//     console.log("No such document!");
//   }
// }

// Function to get all documents in a collection
// async function getCollection() {
//   const querySnapshot = await getDocs(collection(db, "products"));
//   querySnapshot.forEach((doc) => {
//     console.log(`${doc.id}`);
//   });
// }

// Call the function to get data
// getDocument();
// getCollection();

// async function updateDocument() {
//   const docRef = doc(db, "users", "user1");

//   // Update the document with new data
//   try {
//     await updateDoc(docRef, {
//       age: 26,
//       email: "john.updated@example.com",
//     });
//     console.log("Document successfully updated!");
//   } catch (e) {
//     console.error("Error updating document: ", e);
//   }
// }

// // Call the function to update data
// updateDocument();

// async function deleteDocument() {
//   const docRef = doc(db, "users", "6j6AufRhMhZWcJZpMAfOXRZOQ8M2");

//   try {
//     await deleteDoc(docRef);
//     console.log("Document successfully deleted!");
//   } catch (e) {
//     console.error("Error deleting document: ", e);
//   }
// }

// // // Call the function to delete a document
// deleteDocument();

function generateSecureRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(array, (byte) =>
    characters.charAt(byte % characters.length)
  ).join("");
}
