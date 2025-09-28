// This function will update everything, but can probably break this up and call those from here
function updateNumberDisplays() {
  moneyValueElement.textContent = "$" + parseInt(money);
  understandingElement.textContent = parseInt(understanding) + "%";
  thoseThatUnderstandElement.textContent = parseInt(thoseThatUnderstand);

  updateGameDevelopmentStats();
}

function updateGameDevelopmentStats() {
  gameStudioEmployeeCountElement.textContent = currentEmployeeMax
  currentGameQualityValueElement.textContent = currentGameQuality + "%";
  currentGameQualityProgressElement.value = currentGameQuality;
  currentGameInnovationValueElement.textContent = currentGameInnovation + "%";
  currentGameInnovationProgressElement.value = currentGameInnovation;
  developingGameCurrentEmployeeElement.textContent = currentEmployee;
  developingGameEmployeeMaxElement.textContent = currentEmployeeMax;
  releaseGameButtonElement.disabled = !currentGameReadyToRelease;
}

function addEventMessage(message) {
  const entry = document.createElement("div");
  entry.textContent = message;
  entry.id = "eventMessage";
  entry.style.backgroundColor = event_message_background_flip
    ? event_message_color_one
    : event_message_color_two;
  event_message_background_flip = !event_message_background_flip;
  eventMessages.appendChild(entry);
  // Remove oldest messages if too many
  while (eventMessages.children.length > MAX_EVENT_MESSAGES + 1) {
    // +1 because of the "Event Log:" title
    eventMessages.removeChild(eventMessages.children[1]);
  }
  eventMessages.scrollTop = eventMessages.scrollHeight; // Auto-scroll
}

function updateUnderstanding(amount) {
  understanding += amount;
  // understandingElement.textContent = understanding + "%";

  // Check thresholds only once
  for (let i = understandingThresholds.length - 1; i >= 0; i--) {
    if (understanding >= understandingThresholds[i].value) {
      understandingThresholds[i].action();
      understandingThresholds.splice(i, 1); // Remove trigger (leave for now for debugging)
    }
  }
}

function updateThoseThatUnderstand(amount) {
  // check cost
  if (understanding > amount * 100) {
    thoseThatUnderstand += amount;
    updateUnderstanding(-100);
  }
}

// GAME DEVELOPMENT
function updateEmployeeCount(amount) {
  console.log("Update employee count")
  if (amount < thoseThatUnderstand) {
    currentEmployeeMax += amount;
    thoseThatUnderstand -= amount;
  }
}
function releaseGame() {
  if (currentGameReadyToRelease) {
    console.log("GAME CAL");

    // Days calculations? 
  intervalTimer(
    (intervalCount) => {
      console.log("Revenue calculations" + intervalCount);
      // currentEmployee = intervalCount + 1;
      let t = Math.random()
      if (t < .5) {
        currentGameCopiesSold += 2;
      }

      // This is where the development logic will come into play
      updateGameDevelopmentStats();
    },
    200,
    4,
    gameDevelopmentComplete
  );
    money += 200000;
    currentGameReadyToRelease = false;

    // Clear current game development stats etc.
    currentGameInnovation = 0.0;
    currentGameQuality = 0.0;
    updateNumberDisplays();
  }
}

function gameDevelopmentComplete() {
  console.log("GAME FINISHED");
  currentGameReadyToRelease = true;
  updateGameDevelopmentStats();
}

function createGame() {
  if (currentEmployeeMax <= 0) { return }
  currentEmployee = 1;
  // # intervals per employee
  intervalTimer(
    (intervalCount) => {
      console.log("Game progress achieved!" + intervalCount);
      currentEmployee = intervalCount + 1;
      let t = Math.random()
      if (t < .5) {
        currentGameQuality += 2;
      } else {
        currentGameInnovation += 2;
      }

      // This is where the development logic will come into play
    },
    60,
    currentEmployeeMax,
    gameDevelopmentComplete
  );

  updateGameDevelopmentStats();
}

function gameGenreSelected(genre) {
  console.log(genre)
}

document.querySelectorAll(".tab-container").forEach((container) => {
  const buttons = container.querySelectorAll(".tab-buttons button");
  const contents = container.querySelectorAll(".tab-content");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");

      // Hide all
      contents.forEach((c) => (c.style.display = "none"));
      buttons.forEach((b) => b.classList.remove("active"));

      // Show selected
      container.querySelector(`#${target}`).style.display = "block";
      button.classList.add("active");
    });
  });
});
