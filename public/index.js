// // DOM elements
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const logoutButtonInModal = document.getElementById('logoutButtonInModal');
const profileIcon = document.getElementById('profileIcon');
const deleteTaskBtn = document.getElementById('deleteTaskBtn'); // Added missing deleteTaskBtn element

// Check login status
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Task data structure
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize the board
renderTasks();

// Event listeners
addTaskBtn?.addEventListener('click', openAddTaskModal);
closeBtn?.addEventListener('click', closeModal);
taskForm?.addEventListener('submit', saveTask);
window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
});

profileIcon?.addEventListener('click', () => {
  profileModal.classList.remove('hidden');
});

closeProfileModal?.addEventListener('click', () => {
  profileModal.classList.add('hidden');
});

logoutButtonInModal?.addEventListener('click', logoutUser);

// If not logged in, disable Add Task button
if (!isLoggedIn) {
  addTaskBtn.disabled = true;
  addTaskBtn.style.opacity = 0.5;
  addTaskBtn.style.cursor = 'not-allowed';
  addTaskBtn.title = 'Please login to add tasks';
}

// Functions

function openAddTaskModal() {
  if (!isLoggedIn) {
    alert('Please login to add a task!');
    return;
  }
  modalTitle.textContent = 'Add New Task';
  taskForm.reset();
  document.getElementById('taskId').value = '';
  document.getElementById('taskStatus').value = 'todo';
  deleteTaskBtn.style.display = 'none';
  taskModal.style.display = 'block';
}

function openEditTaskModal(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  modalTitle.textContent = 'Edit Task';
  document.getElementById('taskId').value = task.id;
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description;
  document.getElementById('assignedTo').value = task.assignedTo;
  document.getElementById('taskStatus').value = task.status;

  deleteTaskBtn.style.display = 'inline-block';
  taskModal.style.display = 'block';
}

function closeModal() {
  taskModal.style.display = 'none';
}

function saveTask(e) {
  e.preventDefault();

  const taskId = document.getElementById('taskId').value;
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const assignedTo = document.getElementById('assignedTo').value.trim();
  const status = document.getElementById('taskStatus').value;

  if (!title) {
    alert("Title is required");
    return;
  }

  if (taskId) {
    // Edit existing task
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], title, description, assignedTo, status };
    }
  } else {
    // Add new task
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      assignedTo,
      status
    };
    tasks.push(newTask);
  }

  // Save to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
  closeModal();
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    closeModal();
  }
}

function renderTasks() {
  document.querySelectorAll('.task-list').forEach(list => {
    list.innerHTML = '';  // Clear all task lists
  });

  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    const column = document.querySelector(`#${task.status} .task-list`);
    if (column) column.appendChild(taskElement);
  });

  setupDragAndDrop();
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.id = `task-${task.id}`;
  taskElement.draggable = true;

  taskElement.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-description">${task.description}</div>
    <div class="task-meta">
      <div class="task-assigned"><i class="fas fa-user"></i> ${task.assignedTo || 'Unassigned'}</div>
      <div class="task-actions">
        <button class="action-btn" onclick="openEditTaskModal('${task.id}')"><i class="fas fa-edit"></i></button>
        <button class="action-btn" onclick="deleteTask('${task.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="move-options">
      ${getMoveButtons(task)}
    </div>
  `;

  return taskElement;
}

function getMoveButtons(task) {
  let buttons = '';

  if (task.status === 'todo') {
    buttons += `<button class="move-btn" onclick="moveTask('${task.id}', 'inprogress')">Move to In Progress</button>`;
  } else if (task.status === 'inprogress') {
    buttons += `<button class="move-btn" onclick="moveTask('${task.id}', 'todo')">Move to To Do</button>`;
    buttons += `<button class="move-btn" onclick="moveTask('${task.id}', 'done')">Move to Done</button>`;
  } else if (task.status === 'done') {
    buttons += `<button class="move-btn" onclick="moveTask('${task.id}', 'inprogress')">Move to In Progress</button>`;
  }

  return buttons;
}

function moveTask(taskId, newStatus) {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}

function setupDragAndDrop() {
  document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', task.id.replace('task-', ''));
      task.classList.add('dragging');
    });
  });

  document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = column.getAttribute('id');
      moveTask(taskId, newStatus);
      column.classList.remove('drag-over');
    });
  });
}

function logoutUser() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = './login.html';
}
