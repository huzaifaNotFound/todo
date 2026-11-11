import "./style.css";

const todoContainer = document.querySelector("#todo-container");
const btn = document.querySelector("#button");
const input = document.querySelector("#input");
const progressBar = document.querySelector("#progress");
const totalTodoCountSpan = document.querySelector("#total-todo-count");
const completedTodoCountSpan = document.querySelector("#completed-todo-count");

// enter handler
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btn.click();
  }
});

// cards enter and click handlers
todoContainer.addEventListener("click", (e)=>{
  const todo = e.target.closest(".todo-row")

   if (!todo || !todoContainer.contains(todo)) return;

   toggleTodo(todo)
})

todoContainer.addEventListener("keydown", (e)=>{
  const todo = e.target.closest(".todo-row")

  if (!todo || !todoContainer.contains(".todo-row")) return;

  if (e.key === "Enter"){
    e.key.preventDefault();
    toggleTodo(todo)
  }
})

function toggleTodo(todo){
  const completed = todo.classList.toggle("is-completed")

  todo.setAttribute("aria-checked", completed);

  progressUpdate()
}

// todo add handler
btn.addEventListener("click", () => {
 
  const todo = input.value.trim()

  if (!todo) return;

  const capitalizedTodo = todo.charAt(0).toUpperCase() + todo.slice(1);

   const todoDiv = `
    <div
      class="todo-row animate-enter w-full h-13 rounded-xl bg-card flex items-center mb-2.5 cursor-pointer"
      aria-checked="false"
      tabindex="0"
    >

      <div class="relative w-6 h-6 border-muted rounded-md border-[1.5px] mx-4 shrink-0 checkbox">

        <svg
          class="absolute w-8 h-8 -top-2 -left-1 text-ok overflow-visible"
          viewBox="0 0 32 32"
          fill="none"
        >

          <path
            class="check-path"
            d="M4 16L12 24L28 5"
            pathLength="100"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

      </div>

      <p class="task-text font-sans -ml-1 text-[15px] font-normal text-ink">
        ${capitalizedTodo}
      </p>

    </div>
  `;

  todoContainer.insertAdjacentHTML("beforeend", todoDiv);

  input.value = "";

  progressUpdate()

  
});

function progressUpdate(completedTodoCount) {
  const todos = todoContainer.querySelectorAll(".todo-row")

  const totalTodos = todos.length;

  const completedTodos = todoContainer.querySelectorAll(
    ".todo-row.is-completed"
  ).length;


  const percentage = totalTodos === 0
    ? 0
    : (completedTodos / totalTodos) * 100;


  progressBar.style.width = `${percentage}%`;
  completedTodoCountSpan.textContent = completedTodos;
  totalTodoCountSpan.textContent = totalTodos;

}

progressUpdate()