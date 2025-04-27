// DOM elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeBtn = document.querySelector('.close');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const logoutButtonInModal = document.getElementById('logoutButtonInModal');
const profileIcon = document.getElementById('profileIcon'); // Make sure you have id="profileIcon" in HTML

// Check login status
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Task data structure
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize the board
renderTasks();

// Event listeners
addTaskBtn.addEventListener('click', openAddTaskModal);
closeBtn.addEventListener('click', closeModal);
taskForm.addEventListener('submit', saveTask);
window.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal();
});

if (profileIcon) {
  profileIcon.addEventListener('click', () => {
    profileModal.classList.remove('hidden');
  });
}

closeProfileModal.onclick = function () {
  profileModal.style.display = 'none';
}

logoutButtonInModal.addEventListener('click', function () {
  logoutUser();
});

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
  document.getElementById('deleteTaskBtn').style.display = 'none';  // Hide delete button when adding new task
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

  document.getElementById('deleteTaskBtn').style.display = 'inline-block';  // Show delete button when editing task
  taskModal.style.display = 'block';
}

function closeModal() {
  taskModal.style.display = 'none';
}

function saveTask(e) {
  e.preventDefault();

  const taskId = document.getElementById('taskId').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const assignedTo = document.getElementById('assignedTo').value;
  const status = document.getElementById('taskStatus').value;

  if (taskId) {
    // Edit existing task
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        assignedTo,
        status
      };
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

  // Update the UI
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
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.id = `task-${task.id}`;
  taskElement.draggable = true;
  taskElement.addEventListener('dragstart', (e) => drag(e, task.id));

  taskElement.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-description">${task.description}</div>
    <div class="task-meta">
      <div class="task-assigned"><i class="fas fa-user"></i>${task.assignedTo || 'Unassigned'}</div>
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
    buttons += `<button class="move-btn move-to-inprogress" onclick="moveTask('${task.id}', 'inprogress')"><i class="fas fa-arrow-right"></i> Move to Progress</button>`;
  } else if (task.status === 'inprogress') {
    buttons += `<button class="move-btn move-to-todo" onclick="moveTask('${task.id}', 'todo')"><i class="fas fa-arrow-left"></i> Move to To Do</button>`;
    buttons += `<button class="move-btn move-to-done" onclick="moveTask('${task.id}', 'done')"><i class="fas fa-arrow-right"></i> Move to Done</button>`;
  } else if (task.status === 'done') {
    buttons += `<button class="move-btn move-to-inprogress" onclick="moveTask('${task.id}', 'inprogress')"><i class="fas fa-arrow-left"></i> Move to Progress</button>`;
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

function drag(e, taskId) {
  e.dataTransfer.setData('taskId', taskId);
  e.target.classList.add('dragging');
}

function allowDrop(e) {
  e.preventDefault();
  const column = e.target.closest('.column');
  if (column) {
    column.classList.add('drag-over');
  }
}

function drop(e, status) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('taskId');
  moveTask(taskId, status);

  document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));
  document.querySelectorAll('.task').forEach(task => task.classList.remove('dragging'));
}

function logoutUser() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = './login.html';
}
