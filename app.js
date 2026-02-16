"use strict";

 

/**

 * Simple To-Do App

 * Features:

 * - Add tasks

 * - Mark complete

 * - Delete tasks

 * - Filter (All / Active / Completed)

 * - Persist to localStorage

 */

 

const STORAGE_KEY = "todo_app_v1";

 

const form = document.getElementById("todo-form");

const input = document.getElementById("todo-input");

const listEl = document.getElementById("todo-list");

const countEl = document.getElementById("count");

const clearCompletedBtn = document.getElementById("clear-completed");

const filterButtons = document.querySelectorAll(".filter");

 

let todos = loadTodos();

let activeFilter = "all";

 

render();

 

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

 

  todos.unshift({

    id: crypto.randomUUID(),

    text,

    completed: false,

    createdAt: Date.now(),

  });

 

  input.value = "";

  saveTodos(todos);

  render();

});

 

filterButtons.forEach((btn) => {

  btn.addEventListener("click", () => {

    activeFilter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));

    render();

  });

});

 

clearCompletedBtn.addEventListener("click", () => {

  todos = todos.filter((t) => !t.completed);

  saveTodos(todos);

  render();

});

 

listEl.addEventListener("click", (e) => {

  const deleteBtn = e.target.closest("[data-action='delete']");

  if (deleteBtn) {

    const id = deleteBtn.dataset.id;

    todos = todos.filter((t) => t.id !== id);

    saveTodos(todos);

    render();

  }

  const completeBtn = e.target.closest("[data-action='complete']");

  if (completeBtn) {

    const id = completeBtn.dataset.id;

    const todo = todos.find((t) => t.id === id);

    if (todo) {

      todo.completed = true;

      saveTodos(todos);

      render();

    }

  }

  const activeBtn = e.target.closest("[data-action='active']");

  if (activeBtn) {

    const id = activeBtn.dataset.id;

    const todo = todos.find((t) => t.id === id);

    if (todo) {

      todo.completed = false;

      saveTodos(todos);

      render();

    }

  }

});

 

function render() {

  const visible = getVisibleTodos(todos, activeFilter);

 

  listEl.innerHTML = "";

  for (const todo of visible) {

    listEl.appendChild(renderTodoItem(todo));

  }

 

  const remaining = todos.filter((t) => !t.completed).length;

  countEl.textContent = `${remaining} remaining item${remaining === 1 ? "" : "s"} left`;

 

  clearCompletedBtn.disabled = !todos.some((t) => t.completed);

  clearCompletedBtn.style.opacity = clearCompletedBtn.disabled ? "0.55" : "1";

  clearCompletedBtn.style.cursor = clearCompletedBtn.disabled ? "not-allowed" : "pointer";

}

 

function renderTodoItem(todo) {

  const li = document.createElement("li");

  li.className = `item${todo.completed ? " completed" : ""}`;

 

  const statusBtn = document.createElement("button");

  statusBtn.type = "button";

  statusBtn.className = "status-btn";

  if (todo.completed) {

    statusBtn.textContent = "Mark Active";

    statusBtn.dataset.action = "active";

  } else {

    statusBtn.textContent = "Mark Complete";

    statusBtn.dataset.action = "complete";

  }

  statusBtn.dataset.id = todo.id;

 

  const p = document.createElement("p");

  p.className = "text";

  p.textContent = todo.text;

 

  const del = document.createElement("button");

  del.className = "delete";

  del.type = "button";

  del.textContent = "Delete";

  del.dataset.action = "delete";

  del.dataset.id = todo.id;

 

  li.appendChild(statusBtn);

  li.appendChild(p);

  li.appendChild(del);

 

  return li;

}

 

function getVisibleTodos(all, filter) {

  switch (filter) {

    case "active":

      return all.filter((t) => !t.completed);

    case "completed":

      return all.filter((t) => t.completed);

    default:

      return all;

  }

}

 

function loadTodos() {

  try {

    const raw = localStorage.getItem(STORAGE_KEY);

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];

  } catch {

    return [];

  }

}

 

function saveTodos(items) {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

}