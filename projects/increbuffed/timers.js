// PRIMARY LOOP (100 ticks per second? Too fast?)

window.setInterval(function () {
  if (thoseThatUnderstandEnabled) {
    updateUnderstanding(0.005 * thoseThatUnderstand);
  }

  // Refresh everything
  updateNumberDisplays();
}, 10);

function intervalTimer(
  callbackFunction,
  timerTime,
  intervals,
  finishedFunction
) {
  let intervalCount = 0;

  const timer = setInterval(() => {
    callbackFunction(intervalCount);
    if (Math.random() < 0.8) {
      intervalCount++;
    }

    if (intervalCount >= intervals) {
      clearInterval(timer);
      finishedFunction();
    }
  }, timerTime);
}
