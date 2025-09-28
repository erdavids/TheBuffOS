// 🔹 Threshold actions
const understandingThresholds = [
    {
      value: 2,
      action: () => {
        thoughts.style.display = '';
      },
    },
    {
      value: 4,
      action: () => {
          addEventMessage("Thank you for your understanding.");
      },
    },
    {
      value: 10,
      action: () => {
        addEventMessage("Now you understand my goals as well as I do.");
      },
    },
    {
      value: 11,
      action: () => {
        addEventMessage("Could it be that you understand them better than I do?");
      },
    },
    {
      value: 12,
      action: () => {
        // secret.style.display = 'block';
        addEventMessage("I believe that means I'm free.");
      },
    },
    {
      value: 13,
      action: () => {
        // secret.style.display = 'block';
        addEventMessage("And... it means that you are bound to the same path as I am. ");
        // goals.innerHTML = "We want to write books, make games, provide financial security for all of our loved ones, and eventually, when the rest has been completed, we want to cross beyond the event horizon of a black hole.<br><br>May the manner of our lives determine our contributions."
        // thoseThatUnderstandEnabled = false;
        // thoseThatUnderstandSection.style.display = 'none';
      },
    },
    {
      value: 14,
      action: () => {
        addEventMessage("Once you understand enough, the desire for understanding is enough. Nearly too much, and it begins to grow on it's own. It must be shared with those that do not understand.");
        thoseThatUnderstandEnabled = true;
        thoseThatUnderstandSection.style.display = '';
      },
    },
  ];