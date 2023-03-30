let todos = []; // array to store todo items

const addTodo = () => {
  const input = document.getElementById('todo-input');
  const todo = input.value.trim();
  if (todo !== '') {
    todos.push({ todo, completed: false });
    input.value = '';
    renderTodos();
  }
};

const toggleCompleted = (index) => {
  todos[index].completed = !todos[index].completed;
  renderTodos();
};

const filterTodos = (filter) => {
  let filteredTodos;
  if (filter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  } else {
    filteredTodos = todos;
  }
  renderTodos(filteredTodos);
};

const renderTodos = (filteredTodos = todos) => {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  filteredTodos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo.todo;
    if (todo.completed) {
      li.classList.add('completed');
    }
    li.addEventListener('click', () => toggleCompleted(index));
    todoList.appendChild(li);
  });
};

const addBtn = document.getElementById('add-btn');
addBtn.addEventListener('click', addTodo);

const filterSelect = document.getElementById('filter-select');
filterSelect.addEventListener('change', () => filterTodos(filterSelect.value));
