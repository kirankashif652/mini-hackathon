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
  


// DOM elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeBtn = document.querySelector('#taskModal .close');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');

// Task list array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Show Task Modal for adding new task
addTaskBtn?.addEventListener('click', () => {
  taskModal.style.display = 'block';
  modalTitle.innerText = 'Add New Task';
  taskForm.reset();
  document.getElementById('taskId').value = "";
  document.getElementById('taskStatus').value = "todo";
});

// Close modal on clicking close button
closeBtn?.addEventListener('click', () => {
  taskModal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target == taskModal) {
    taskModal.style.display = 'none';
  }
});

// Save task on form submit
taskForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskId = document.getElementById('taskId').value;
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const assignedTo = document.getElementById('assignedTo').value.trim();
  const status = document.getElementById('taskStatus').value || 'todo';

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  if (taskId) {
    // Edit existing task
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], title, description, assignedTo, status };
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      assignedTo,
      status,
    };
    tasks.push(newTask);
  }

  // Save tasks
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Clear form and hide modal
  taskForm.reset();
  taskModal.style.display = 'none';

  // Optionally you can call renderTasks(); here to update the task list UI
  renderTasks();
});

// Render tasks (you can customize this as needed)
function renderTasks() {
  const taskListContainer = document.getElementById('taskList'); // assume you have a div with id=taskList
  if (!taskListContainer) return;

  taskListContainer.innerHTML = '';

  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <p><strong>Assigned To:</strong> ${task.assignedTo || 'N/A'}</p>
      <small>Status: ${task.status}</small>
    `;
    taskListContainer.appendChild(taskDiv);
  });
}

// Initial render
renderTasks();




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


// DOM Elements
const profileIcon = document.getElementById('profileIcon');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');

// Show Profile Modal when profile icon is clicked
profileIcon?.addEventListener('click', () => {
  profileModal.classList.remove('hidden');  // Show modal
});

// Close Profile Modal when close button is clicked
closeProfileModal?.addEventListener('click', () => {
  profileModal.classList.add('hidden');  // Hide modal
});

// Profile Icon Click
profileIcon?.addEventListener('click', function () {
  if (userLoggedIn) {
    // Show profile modal
    profileModal.classList.remove('hidden');
    profileModal.style.display = 'block';
  } else {
    alert('Please log in first!');
    window.location.href = './login.html'; // Redirect to login if not logged in
  }
});

// Close Profile Modal
closeProfileModalBtn?.addEventListener('click', function () {
  profileModal.classList.add('hidden');
  profileModal.style.display = 'none';
});

// Ensure modal closes if clicked outside
window.addEventListener('click', function (e) {
  if (e.target === profileModal) {
    profileModal.classList.add('hidden');
    profileModal.style.display = 'none';
  }
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




// Add Task Example:
const addTaskToFirebase = async (task) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};



  
  // -------------------- EVENT LISTENERS --------------------
  document.getElementById("signupForm")?.addEventListener("submit", register);
  document.getElementById("loginBtn")?.addEventListener("click", signIn);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("googleLoginBtn")?.addEventListener("click", googleSignIn);
  document.getElementById("updatePasswordBtn")?.addEventListener("click", updatePasswordFunction);
  document.getElementById("forgotPasswordLink")?.addEventListener("click", forgotPassword)