import "./style.css";

const pad = (n) => String(n).padStart(2, "0");

//YYYY-MM-DD
const iso = (date) => date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());

const fromIso = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const dateElement = document.querySelector("#date");
const headingElement = document.querySelector("#heading");
const daysContainer = document.querySelector("#days");

const RANGE = 7; 

let today = iso(new Date());
let selected = today;

const pendingTexts = new WeakMap();

function setText(element, text) {
  if (!element) return;

  element.getAnimations().forEach((animation) => animation.cancel());
  pendingTexts.delete(element);
  element.textContent = text;
}

function animateText(element, text) {
  if (!element) return;

  const currentText = pendingTexts.get(element) ?? element.textContent.trim();

  if (currentText === text) return;

  pendingTexts.set(element, text);

  element.getAnimations().forEach((animation) => animation.cancel());

  const fadeOut = element.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-6px)" },
    ],
    {
      duration: 150,
      easing: "ease-in",
      fill: "forwards",
    },
  );

  fadeOut.finished
    .then(() => {
      if (pendingTexts.get(element) !== text) return;

      element.textContent = text;
      pendingTexts.delete(element);

      fadeOut.cancel();

      element.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 200,
          easing: "ease-out",
        },
      );
    })
    .catch(() => {});
}

function getHeading(key) {
  const diff = Math.round((fromIso(key) - fromIso(today)) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";

  return fromIso(key).toLocaleDateString("en-US", { weekday: "long" });
}

function renderHeader(animate = true) {
  const write = animate ? animateText : setText;

  write(dateElement, formatDate(fromIso(selected)));
  write(headingElement, getHeading(selected));
}

function renderDays() {
  const base = fromIso(today);

  daysContainer.innerHTML = Array.from({ length: RANGE * 2 + 1 }, (_, i) => {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i - RANGE);
    const dateKey = iso(date);

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    return `
      <button
        type="button"
        data-day="${dateKey}"
        aria-pressed="false"
        aria-label="${formatDate(date)}"
        ${dateKey === today ? 'aria-current="date"' : ""}
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
  }).join("");
}

function updateDateCards() {
  daysContainer.querySelectorAll("[data-day]").forEach((card) => {
    const isSelected = card.dataset.day === selected;

    const weekday = card.querySelector(".weekday");
    const dayNumber = card.querySelector(".day-number");

    card.setAttribute("aria-pressed", String(isSelected));

    card.classList.toggle("bg-btn", isSelected);

    card.classList.toggle("border-transparent", isSelected);
    card.classList.toggle("border-muted/30", !isSelected);

    card.classList.toggle("hover:-translate-y-0.5", !isSelected);
    card.classList.toggle("hover:bg-chip", !isSelected);
    card.classList.toggle("hover:border-transparent", !isSelected);

    weekday.classList.toggle("text-white", isSelected);
    weekday.classList.toggle("text-muted", !isSelected);
    weekday.classList.toggle("font-semibold", isSelected);
    weekday.classList.toggle("font-medium", !isSelected);
    weekday.classList.toggle("group-hover:text-ink", !isSelected);

    dayNumber.classList.toggle("text-white", isSelected);
    dayNumber.classList.toggle("text-muted", !isSelected);
    dayNumber.classList.toggle("group-hover:text-ink", !isSelected);

    card.querySelector(".task-dot").classList.toggle("hidden", card.dataset.day !== today);
  });
}

const css = (name, fallback) => {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let slide; 

function centerDay(smooth = true) {
  const box = daysContainer;
  const card = box.querySelector(`[data-day="${selected}"]`);
  if (!card) return;

  cancelAnimationFrame(slide);

  const cardCenter =
    card.getBoundingClientRect().left -
    box.getBoundingClientRect().left +
    box.scrollLeft +
    card.offsetWidth / 2;

  const from = box.scrollLeft;
  const to = Math.max(0, Math.min(cardCenter - box.clientWidth / 2, box.scrollWidth - box.clientWidth));

  if (!smooth || reduceMotion.matches || from === to) {
    box.scrollLeft = to;
    return;
  }

  const start = performance.now(),
    ms = css("--slide-ms", 450),
    power = css("--slide-power", 3);

  const step = (now) => {
    const p = Math.min(1, (now - start) / ms); 
    box.scrollLeft = from + (to - from) * (1 - Math.pow(1 - p, power)); 
    if (p < 1) slide = requestAnimationFrame(step);
  };

  slide = requestAnimationFrame(step);
}

["wheel", "touchstart", "pointerdown"].forEach((type) =>
  daysContainer.addEventListener(type, () => cancelAnimationFrame(slide), { passive: true }),
);

function refreshToday() {
  const newToday = iso(new Date());

  if (newToday === today) return;

  const wasOnToday = selected === today;

  today = newToday;
  if (wasOnToday) selected = today;

  renderDays();

  if (!daysContainer.querySelector(`[data-day="${selected}"]`)) selected = today;

  updateDateCards();
  renderHeader();
  centerDay(false);
}

let midnightTimer;

function scheduleMidnightRefresh() {
  clearTimeout(midnightTimer);

  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  midnightTimer = setTimeout(
    () => {
      refreshToday();
      scheduleMidnightRefresh();
    },
    nextMidnight - now + 50,
  );
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshToday();
    scheduleMidnightRefresh();
  }
});

daysContainer.addEventListener("click", (e) => {
  const card = e.target.closest("[data-day]");

  if (!card) return;

  selected = card.dataset.day;

  renderHeader();
  updateDateCards();
  centerDay(true);
});

window.addEventListener("resize", () => centerDay(false));

renderDays();
updateDateCards();
renderHeader(false);
scheduleMidnightRefresh();

requestAnimationFrame(() => {
  centerDay(false);
});