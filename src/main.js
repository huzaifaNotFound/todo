import './style.css'

const todoContainer = document.querySelector("#todo-container")
const btn = document.querySelector("#button")

const todo = `<div id="todo" class="w-full h-13 rounded-xl bg-card flex items-center mb-2.5">
          <div class="w-6 h-6 border-muted rounded-md border-[1.5px] mx-4"></div>
          <p class="font-sans -ml-1 text-[15px] font-normal text-ink">Strech for 5 mins</p>
        </div>`

btn.addEventListener("click",() =>{
  todoContainer.insertAdjacentHTML("beforeend",todo)

})