// script.js
let todos = [];
let currentUser = '';

function showLoginForm() {
  document.getElementById('login-box').style.display = 'block';
  document.getElementById('register-box').style.display = 'none';
}

function showRegisterForm() {
  document.getElementById('register-box').style.display = 'block';
  document.getElementById('login-box').style.display = 'none';
}

function registerUser() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!username || !password) return alert("Please fill out all fields.");
  if (localStorage.getItem('pass_' + username)) return alert("User already exists. Please login.");
  localStorage.setItem('pass_' + username, password);
  alert("Registration successful! Please login.");
  showLoginForm();
}

function loadUserTodos() {
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value;
  if (!usernameInput || !passwordInput) return alert("Please enter both username and password.");
  const storedPassword = localStorage.getItem('pass_' + usernameInput);
  if (!storedPassword) return alert("User not found. Please register.");
  if (storedPassword !== passwordInput) return alert("Incorrect password!");

  currentUser = usernameInput;
  todos = JSON.parse(localStorage.getItem('todos_' + currentUser)) || [];
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'none';
  document.querySelector('.switch-buttons').style.display = 'none';
  document.getElementById('todoApp').style.display = 'block';
  document.getElementById('user-title').textContent = currentUser + "'s Todo List";
  renderTodos();
}

function renderTodos() {
  const container = document.getElementById('todo-container');
  container.innerHTML = '';
  todos.forEach((todo, index) => {
    const row = document.createElement('div');
    row.className = 'todo-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.oninput = () => {
      todos[index].text = input.value;
      saveTodos();
    };

    const label1 = document.createElement('label');
    label1.className = 'tick-label';
    label1.textContent = 'Accepted';
    const tick1 = document.createElement('input');
    tick1.type = 'checkbox';
    tick1.className = 'tick';
    tick1.checked = todo.tick1;
    tick1.onchange = () => {
      todos[index].tick1 = tick1.checked;
      if (tick1.checked) todos[index].tick2 = false;
      saveTodos();
      renderTodos();
    };

    const label2 = document.createElement('label');
    label2.className = 'tick-label';
    label2.textContent = 'Rejected';
    const tick2 = document.createElement('input');
    tick2.type = 'checkbox';
    tick2.className = 'tick tick-red';
    tick2.checked = todo.tick2;
    tick2.onchange = () => {
      todos[index].tick2 = tick2.checked;
      if (tick2.checked) todos[index].tick1 = false;
      saveTodos();
      renderTodos();
    };

    const waiting = document.createElement('span');
    waiting.className = 'waiting-msg';
    if (!todo.tick1 && !todo.tick2) waiting.textContent = 'Waiting...';

    const date = document.createElement('span');
    date.className = 'date-text';
    date.textContent = todo.date;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    };

    row.appendChild(input);
    row.appendChild(label1);
    row.appendChild(tick1);
    row.appendChild(label2);
    row.appendChild(tick2);
    row.appendChild(waiting);
    row.appendChild(date);
    row.appendChild(removeBtn);

    container.appendChild(row);
  });
}

function addRow() {
  const newTodo = {
    text: '',
    tick1: false,
    tick2: false,
    date: new Date().toLocaleDateString()
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos_' + currentUser, JSON.stringify(todos));
}

// Show login form by default on page load
window.onload = function () {
  showLoginForm();
};
