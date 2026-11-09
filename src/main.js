import './style.css'

const todoContainer = document.querySelector("#todo-container")
const btn = document.querySelector("#button")
const input = document.querySelector("#input")


// enter handler
input.addEventListener("keydown", (e)=>{
  if (e.key === "Enter"){
    e.preventDefault()
    btn.click()
  }
})

// todo add handler
btn.addEventListener("click",() =>{
  let completedTodoCount = 1
  let todo = input.value
  if (!todo) return
  let capitalizedTodo = todo.charAt(0).toUpperCase() + todo.slice(1);
  let todoDiv = `<div
            id="todo"
            class="todo-row animate-enter w-full h-13 rounded-xl bg-card flex items-center mb-2.5 cursor-pointer"
            aria-checked="false"
            tabindex="0"
          >
            <div class="relative w-6 h-6 border-muted rounded-md border-[1.5px] mx-4 shrink-0 checkbox">
              <svg class="absolute w-8 h-8 -top-2 -left-1 text-ok overflow-visible" viewBox="0 0 32 32" fill="none">
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
            <p class="task-text font-sans -ml-1 text-[15px] font-normal text-ink">${capitalizedTodo}</p>
          </div>`
  todoContainer.insertAdjacentHTML("beforeend",todoDiv)

  progressUpdate(completedTodoCount);
})

function progressUpdate(completedTodoCount){
  let TodoCompletedPercentage = (completedTodoCount)/(todoContainer.childElementCount)*100
  let progressBar = document.querySelector("#progress")
  let totalTodoCountSpan = document.querySelector("#total-todo-count")

  totalTodoCountSpan.innerHTML = todoContainer.childElementCount
  progressBar.style= `width: ${TodoCompletedPercentage}%`
}


// handling completion toggle
const todos = document.querySelectorAll("#todo");

todos.forEach((todo)=>{

  function toggleTodo() {
    const completed = todo.classList.toggle("is-completed");
  
    todo.setAttribute("aria-checked", completed);
  }
  
  todo.addEventListener("click", toggleTodo);
  
  todo.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTodo();
    }
  });
})
