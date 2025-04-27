// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import { getAuth ,
   onAuthStateChanged ,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   sendEmailVerification,
   updatePassword,
  GoogleAuthProvider,
  signInWithPopup

   } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

   import { doc,
     updateDoc

    } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
 

const firebaseConfig = {
  apiKey: "AIzaSyCoDBRqoaCXzB-zYmQcoM_G4IPRYtfIZUQ",
  authDomain: "task-tracker-f6ad9.firebaseapp.com",
  projectId: "task-tracker-f6ad9",
  storageBucket: "task-tracker-f6ad9.firebasestorage.app",
  messagingSenderId: "18806719260",
  appId: "1:18806719260:web:4c1aa125a3e04b299c30d9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export{
    auth ,
   onAuthStateChanged ,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   sendEmailVerification,
   updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
     updateDoc
  
}