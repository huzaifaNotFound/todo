import "./style.css";

function updateDateDisplay() {
  const now = new Date();

  const formattedDateToday = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
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
