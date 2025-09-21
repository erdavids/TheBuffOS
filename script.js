let selectionBox = null;
let startX = 0;
let startY = 0;

const resizeObserver = new ResizeObserver((entries) => {
  removeSelectionBox();
});

// Make a window draggable
function makeDraggable(el) {
  const title = el.querySelector(".draggable");
  let offsetX = 0,
    offsetY = 0,
    isDown = false;

  if (title) {
    title.addEventListener("mousedown", (e) => {
      isDown = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    });
  }
  el.addEventListener("mousedown", (e) => {
    el.style.zIndex = int(Date.now() % 10000000.0); // bring to front
  });

  document.addEventListener("mouseup", () => (isDown = false));

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    if (selectionBox) {
      selectionBox.remove();
    }

    // Try to prevent window from going off screen?
    let l = min(
      max(e.clientX - offsetX, 0),
      window.innerWidth - el.offsetWidth
    );
    let t = min(
      max(e.clientY - offsetY, 0),
      window.innerHeight - el.offsetHeight
    );
    el.style.left = l + "px";
    el.style.top = t + "px";
  });
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.style.display = "block";
    win.style.zIndex = Date.now(); // bring to front
  }

  refreshDraggable();
}

function openImage(filename, title, { width = "650px" } = {}) {
  // Create a new window
  const win = document.createElement("div");
  win.className = "image-window window"; // reuse your window CSS/animations
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.width = width;

  win.innerHTML = `
    <div class="draggable title-bar">
      <span>${title}</span>
      <button class="expand">></button>
      <button class="close">X</button>
    </div>
    <div class="content">
      <img class="image-in-window" src="images/${filename}" alt="${title}" />
    </div>
  `;

  document.body.appendChild(win);

  // Hook close button
  win.querySelector(".close").addEventListener("click", () => {
    win.remove();
  });

  win.querySelector(".expand").addEventListener("click", () => {
    win.classList.add("expanded");
    win.style.width = "50%";
    win.style.height = "100%";
    win.style.left = "50%";
    win.style.top = "0px";
    setInterval(() => {
      win.classList.remove("expanded");
    }, 500);
  });

  // Animate in
  requestAnimationFrame(() => win.classList.add("show"));

  // Make draggable again
  refreshDraggable();
}

function openTextWindow(filename, title) {
  fetch(`texts/${filename}`)
    .then((response) => response.text())
    .then((text) => {
      // Create a new window
      const win = document.createElement("div");
      win.className = "window"; // reuse your window CSS/animations
      win.style.top = "100px";
      win.style.left = "100px";
      win.style.width = "400px";

      win.innerHTML = `
        <div class="draggable title-bar">
          <span>${title}</span>
          <button class="expand">></button>
          <button class="close">X</button>
        </div>
        <div class="content">
          <pre>${text}</pre>
        </div>
      `;

      document.body.appendChild(win);

      // Hook close button
      win.querySelector(".close").addEventListener("click", () => {
        win.remove();
      });

      win.querySelector(".expand").addEventListener("click", () => {
        win.classList.add("expanded");
        win.style.width = "50%";
        win.style.height = "100%";
        win.style.left = "50%";
        win.style.top = "0px";
        setInterval(() => {
          win.classList.remove("expanded");
        }, 500);
      });

      // Animate in
      requestAnimationFrame(() => win.classList.add("show"));
    })
    .catch((err) => console.error("Error loading file:", err))
    .finally(() => {
      refreshDraggable();
    });
}

function openHTMLWindow(filename, title, top, left, width, height) {
  fetch(`windows/${filename}`)
    .then((response) => response.text())
    .then((html) => {
      // Create a new window
      const win = document.createElement("div");
      win.className = "window";
      win.style.top = top;
      win.style.left = left;
      win.style.width = width;
      win.style.height = height;

      win.innerHTML = `
        <div class="draggable title-bar">
          <span>${title}</span>
          <button class="expand">></button>
          <button class="close">X</button>
        </div>
        <div class="content">
          ${html}
        </div>
      `;

      document.body.appendChild(win);

      // Hook close button
      win.querySelector(".close").addEventListener("click", () => {
        win.remove();
      });

      win.querySelector(".expand").addEventListener("click", () => {
        win.classList.add("expanded");
        win.style.width = "50%";
        win.style.height = "100%";
        win.style.left = "50%";
        win.style.top = "0px";
        setInterval(() => {
          win.classList.remove("expanded");
        }, 500);
      });

      // Animate in
      requestAnimationFrame(() => win.classList.add("show"));
    })
    .catch((err) => console.error("Error loading HTML:", err))
    .finally(() => {
      refreshDraggable();
    });
}

function openDirectoryWindow() {
  
}

// Load seperately to avoid huge performance from having it "hidden"
function loadChess() {
  // Prevent double-loading
  if (document.getElementById("chess")) {
    document.getElementById("chess").style.display = "block";
    return;
  }

  console.log("LOADING CHESS");

  // 1. Load the HTML for the chess window
  fetch("projects/crooked-rook/chess-window.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      console.log("LOADING HTML");

      const chessWin = document.getElementById("chess");

      // Close button
      chessWin.querySelector(".close").addEventListener("click", () => {
        stop_chess();
        chessWin.remove();
      });

      chessWin.querySelector(".expand").addEventListener("click", () => {
        chessWin.classList.add("expanded");
        chessWin.style.width = "50%";
        chessWin.style.height = "98%";
        chessWin.style.left = "48%";
        chessWin.style.top = "0px";
        setInterval(() => {
          chessWin.classList.remove("expanded");
        }, 500);
      });

      makeDraggable(chessWin);

      // if (!document.getElementById("chess-script")) {
      //   const script = document.createElement("script");
      //   script.src = "projects/crooked-rook/chess-engine.js";
      //   script.id = "chess-script";
      //   document.body.appendChild(script);
      // }
    })
    .finally(() => {
      start_chess();
    });
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.style.display = "none";
  }
}

function toggleWindow(id) {
  const win = document.getElementById(id);
  if (win.style.display == "block") {
    win.style.display = "none";
  } else {
    win.style.display = "block";
  }
}

function refreshDraggable() {
  console.log("refresh draggable");
  observe();
  // Keep your draggable + close button setup
  document.querySelectorAll(".window").forEach((win) => {
    makeDraggable(win);
  });

  // Keep your draggable + close button setup
  document.querySelectorAll(".dark-window").forEach((win) => {
    makeDraggable(win);
  });

  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const win = e.target.closest(".window");
      closeWindow(win.id);
    });
  });
}

refreshDraggable();

// SELECTION BOX??

document.addEventListener("mousedown", (e) => {
  // Mouse click, remove selection if it exists?
  if (e.button === 2) {
    selectionBox.remove();
    return;
  }
  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement("div");
  selectionBox.classList.add("selection-box");
  document.body.appendChild(selectionBox);

  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
});

document.addEventListener("mousemove", (e) => {
  if (!selectionBox) return;
  e.stopPropagation();
  const currentX = e.clientX;
  const currentY = e.clientY;

  selectionBox.style.left = `${Math.min(startX, currentX)}px`;
  selectionBox.style.top = `${Math.min(startY, currentY)}px`;
  selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
  selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
});

document.addEventListener("mouseup", (e) => {
  if (!selectionBox) return;

  selectionBox.remove();
});

document.addEventListener("resize", (e) => {
  console.log("RESIZING");
  if (selectionBox) {
    selectionBox.remove();
  }
});

function removeSelectionBox() {
  if (selectionBox) {
    selectionBox.remove();
  }
}

function observe() {
  const windows = document.querySelectorAll(".window");
  for (let w of windows) {
    resizeObserver.observe(w);
  }
}
