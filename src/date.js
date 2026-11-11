import "./style.css";


function updateDateDisplay() {
  const now = new Date();

  const formattedDateToday = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dateElement = document.querySelector("#date");

  if (dateElement) {
    dateElement.innerHTML = formattedDateToday;
  }

  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  setTimeout(updateDateDisplay, msUntilMidnight + 50);
}

updateDateDisplay();



//date cards

// YYYY-MM-DD
const pad = (n) => String(n).padStart(2, "0");

const iso = (date) =>
  date.getFullYear() + "-" +
  pad(date.getMonth() + 1) + "-" +
  pad(date.getDate());

const today = iso(new Date());

const days = [];

for (let i = -7; i <= 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  days.push(date);
}

let selected = today;

const daysContainer = document.querySelector("#days");
daysContainer.innerHTML = days
  .map((date) => {
    const dateKey = iso(date);

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    return `
      <button
        type="button"
        data-day="${dateKey}"
        aria-pressed="false"
        class="date-card group shrink-0 w-12.5 h-14.5
        border border-muted/30 rounded-xl
        flex flex-col items-center font-sans
        p-1 pt-1.5 cursor-pointer
        transition-all duration-300"
      >
        <span class="weekday font-medium text-[10px]
          tracking-widest uppercase mb-0.5
          transition-all duration-300">
          ${weekday}
        </span>

        <span class="day-number font-bold text-[15px]
          transition-all duration-300">
          ${date.getDate()}
        </span>

        <span class="task-dot w-1 h-1 rounded-full
          bg-accent mt-auto mb-0.5 hidden">
        </span>
      </button>
    `;
  })
  .join("");



function updateDateCards() {
  document.querySelectorAll("[data-day]").forEach((card) => {
    const isSelected = card.dataset.day === selected;

    const weekday = card.querySelector(".weekday");
    const dayNumber = card.querySelector(".day-number");

    card.setAttribute("aria-pressed", isSelected);

    card.classList.toggle("bg-btn", isSelected);
    card.classList.toggle("border-none", isSelected);
    card.classList.toggle("border-muted/30", !isSelected);

    card.classList.toggle("hover:-translate-y-0.5", !isSelected);
    card.classList.toggle("hover:bg-chip", !isSelected);
    card.classList.toggle("hover:border-none", !isSelected);

    weekday.classList.toggle("text-white", isSelected);
    weekday.classList.toggle("text-muted", !isSelected);
    weekday.classList.toggle("font-semibold", isSelected);
    weekday.classList.toggle("group-hover:text-ink", !isSelected);

    dayNumber.classList.toggle("text-white", isSelected);
    dayNumber.classList.toggle("text-muted", !isSelected);
    dayNumber.classList.toggle("group-hover:text-ink", !isSelected);

    const hasTasks = card.dataset.day === today;

    card.querySelector(".task-dot").classList.toggle(
      "hidden", !hasTasks
    );
  });
}

// center cardd
function centerDay(smooth = true) {
  const card = document.querySelector(
    `[data-day="${selected}"]`
  );

  if (!card) return;

  const box = daysContainer;

  const cardCenter =
    card.getBoundingClientRect().left -
    box.getBoundingClientRect().left +
    box.scrollLeft +
    card.offsetWidth / 2;

  const target = cardCenter - box.clientWidth / 2;

  box.scrollTo({
    left: target,
    behavior: smooth ? "smooth" : "auto",
  });
}


daysContainer.addEventListener("click", (e) => {
  const card = e.target.closest("[data-day]");

  if (!card) return;

  selected = card.dataset.day;

  updateDateCards();
  centerDay(true);
});



updateDateCards();

requestAnimationFrame(() => {
  centerDay(false);
});