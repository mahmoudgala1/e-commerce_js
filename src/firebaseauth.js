import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
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

const signUp = document.getElementById("submitSignUp");

const firstName = document.getElementById("fname");
const lastName = document.getElementById("lname");
const rEmail = document.getElementById("rEmail");
const rPassword = document.getElementById("rPassword");

const email = document.getElementById("email");
const password = document.getElementById("password");

signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const errors = inputValidationsForRegister({
    firstName,
    lastName,
    rEmail,
    rPassword,
  });
  if (Object.values(errors).some((error) => error.value !== "")) {
    showErrorMessageForRegister(errors);
    return;
  }
  createUserWithEmailAndPassword(auth, rEmail.value, rPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: rEmail.value,
        firstName: firstName.value,
        lastName: lastName.value,
        role: "user",
        image: "./img/avatar.png",
      };
      toastr.success("Account Created Successfully", "Success");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        toastr.error("Email Address Already Exists", "Error");
      } else {
        toastr.error("unable to create User", "Error");
      }
    });
});

const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const errors = inputValidationsForLogin({ email, password });
  if (Object.values(errors).some((error) => error.value !== "")) {
    showErrorMessageForLogin(errors);
    return;
  }
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      toastr.success("login is successful", "Success");
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        localStorage.setItem(
          "loggedInUserId",
          JSON.stringify({
            id: docSnap.id,
            fname: docSnap.data().firstName,
            lname: docSnap.data().lastName,
            email: docSnap.data().email,
            role: docSnap.data().role,
            image: docSnap.data().image ?? "./img/avatar.png",
          })
        );
      } else {
        console.log("No such document!");
      }
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        toastr.error("Incorrect Email or Password", "Error");
      } else {
        toastr.error("Account does not Exist", "Error");
      }
    });
});

const inputValidationsForRegister = (inputsData) => {
  const errors = {};
  const { firstName, lastName, rEmail, rPassword } = inputsData;
  if (firstName.value.trim() === "") {
    errors.firstName = "This field is required";
  }
  if (lastName.value.trim() === "") {
    errors.lastName = "This field is required";
  }
  if (rEmail.value.trim() === "") {
    errors.rEmail = "This field is required";
  }
  if (rPassword.value.trim() === "") {
    errors.rPassword = "This field is required";
  }

  return errors;
};

const showErrorMessageForRegister = (errors) => {
  if (errors.firstName) {
    firstName.parentElement.nextElementSibling.textContent = errors.firstName;
  } else {
    firstName.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.lastName) {
    lastName.parentElement.nextElementSibling.textContent = errors.lastName;
  } else {
    lastName.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.rEmail) {
    rEmail.parentElement.nextElementSibling.textContent = errors.rEmail;
  } else {
    rEmail.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.rPassword) {
    rPassword.parentElement.nextElementSibling.textContent = errors.rPassword;
  } else {
    rPassword.parentElement.nextElementSibling.textContent = "";
  }
};

const inputValidationsForLogin = (inputsData) => {
  const errors = {};
  const { email, password } = inputsData;
  if (email.value.trim() === "") {
    errors.email = "This field is required";
  }
  if (password.value.trim() === "") {
    errors.password = "This field is required";
  }

  return errors;
};

const showErrorMessageForLogin = (errors) => {
  if (errors.email) {
    email.parentElement.nextElementSibling.textContent = errors.email;
  } else {
    email.parentElement.nextElementSibling.textContent = "";
  }
  if (errors.password) {
    password.parentElement.nextElementSibling.textContent = errors.password;
  } else {
    password.parentElement.nextElementSibling.textContent = "";
  }
};
