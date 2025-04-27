import {
    auth,
    onAuthStateChanged,
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
    
  } from "./firebase-config.js"


  
  
  // -------------------- SIGNUP --------------------
  const register = async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
  
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed up =>", user);
        alert("Signup successful! Please check your email to verify your account.");
  
        // Send email verification
        sendEmailVerification(user)
          .then(() => {
            console.log("Verification email sent");
          })
          .catch((error) => {
            console.error("Email verification error:", error);
          });
      })
      .catch((error) => {
        alert("Signup Error: " + error.message);
      });
  };
  
  // -------------------- LOGIN --------------------
  const signIn = (e) => {
    e.preventDefault();
  
    const email = document.getElementById("signIn-email").value;
    const password = document.getElementById("signIn-password").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          return;
        }
  
        console.log("Logged in =>", user);
        alert("Login successful!");
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  };
  
  // -------------------- GOOGLE LOGIN --------------------
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
  
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google user:", user);
        alert("Google login successful!");
      })
      .catch((error) => {
        alert("Google login failed: " + error.message);
      });
  };
  
  // -------------------- UPDATE PASSWORD --------------------
  const updatePasswordFunction = (e) => {
    e.preventDefault();
  
    const newPassword = document.getElementById("newPswd").value;
  
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }
  
    const user = auth.currentUser;
  
    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          alert("Password updated successfully!");
        })
        .catch((error) => {
          alert("Error updating password: " + error.message);
        });
    } else {
      alert("No user is logged in.");
    }
  };
  
  // -------------------- FORGOT PASSWORD --------------------
  const forgotPassword = (e) => {
    e.preventDefault();
  
    const email = document.getElementById("signIn-email").value;
  
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
  
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  
  
  // -------------------- LOGOUT --------------------
  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        alert("You have been logged out.");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        alert("Error signing out: " + error.message);
      });
  };
  
  // -------------------- AUTH STATE OBSERVER --------------------
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user.email);
      alert("User logged in: " + user.email);
    } else {
      console.log("User not logged in");
      alert("User logged out.");
    }
  });
  
  
  ///////////////// update profile Image
  
//   const oldImage = document.getElementById("profImg");
  
//   const uploadImg = async ()=>{
//     const file = document.getElementById("image");
//     const selectedImg = file.files[0];
  
//     const formData = new FormData()
//     formData.append("file", selectedImg)
//     formData.append("upload_preset", "firebaseXcloudinary")
//     formData.append("cloud_name", "duo0iqvpr")
  
  
//     try {
//        const response =  await fetch(`https://api.cloudinary.com/v1_1/duo0iqvpr/image/upload`,{
//             method:"POST",
//             body:formData
//         })
  
  
//            const data = await response.json()
//            const url=  data.secure_url
  
//            /////////////////////// add image in firebase
  
//            const userRef = doc(db, "users", auth.currentUser.uid);
  
//            await updateDoc(userRef, {
//              proFileImg:url
//            });
//            oldImage.src = url
  
  
//     } catch (error) {
//         console.log(error);
        
//     }
  
//   }
  
//   document.querySelector("#uploadBtn").addEventListener("click", uploadImg)




// Task Modal
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeTaskModalBtn = document.querySelector('#taskModal .close');

// Profile Modal
const profileIcon = document.getElementById('profileIcon');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModal');
const profileEmail = document.getElementById('profileEmail');

// User is logged in state
let userLoggedIn = false;

// Check auth state
auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in
    userLoggedIn = true;
    addTaskBtn.style.display = 'inline-block'; // Show "Add Task" button
    profileEmail.innerText = user.email;
  } else {
    // User is not logged in
    userLoggedIn = false;
    addTaskBtn.style.display = 'none'; // Hide "Add Task" button
  }
});

// Add Task Button click
addTaskBtn?.addEventListener('click', function () {
  if (userLoggedIn) {
    taskModal.style.display = 'block';
    document.getElementById('modalTitle').innerText = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = "";
    document.getElementById('taskStatus').value = "todo";
  } else {
    alert('Please log in first!');
    window.location.href = './login.html'; // Redirect to login if not logged in
  }
});

// Close Task Modal
closeTaskModalBtn?.addEventListener('click', function () {
  taskModal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target == taskModal) {
    taskModal.style.display = 'none';
  }
});

// Profile Icon Click
profileIcon?.addEventListener('click', function () {
  if (userLoggedIn) {
    profileModal.style.display = 'block';
  } else {
    alert('Please log in first!');
    window.location.href = './login.html';
  }
});

// Close Profile Modal
closeProfileModalBtn?.addEventListener('click', function () {
  profileModal.style.display = 'none';
});

// Logout from modal
const logoutButtonInModal = document.getElementById('logoutButtonInModal');
logoutButtonInModal?.addEventListener('click', function () {
  signOut(auth).then(() => {
    alert('Logged out successfully!');
    window.location.href = './login.html'; // Redirect to login page after logout
  }).catch((error) => {
    console.error('Logout error:', error);
  });
});

// Your task form and task saving code goes here...

  
  // -------------------- EVENT LISTENERS --------------------
  document.getElementById("signupForm")?.addEventListener("submit", register);
  document.getElementById("loginBtn")?.addEventListener("click", signIn);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("googleLoginBtn")?.addEventListener("click", googleSignIn);
  document.getElementById("updatePasswordBtn")?.addEventListener("click", updatePasswordFunction);