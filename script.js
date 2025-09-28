let selectionBox = null;
let startX = 0;
let startY = 0;

const windowSizeDefault = {
  top: "20%",
  left: "25%",
  width: "50%",
  height: "60%",
};

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

function openWindow(win) {
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
  // requestAnimationFrame(() => win.classList.add("show"));

  refreshDraggable();
}

function openImage(filename, title, options = {}) {
  const opts = { ...windowSizeDefault, ...options };
  // Create a new window
  const win = document.createElement("div");
  win.className = "image-window window"; // reuse your window CSS/animations
  win.style.top = opts.top;
  win.style.left = opts.left;
  win.style.width = opts.width;
  win.style.height = opts.height;

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

  openWindow(win);

  // Make draggable again
  refreshDraggable();
}

function openTextWindow(filename, title, options = {}) {
  const opts = { ...windowSizeDefault, ...options };

  fetch(`texts/${filename}`)
    .then((response) => response.text())
    .then((text) => {
      // Create a new window
      const win = document.createElement("div");
      win.className = "window"; // reuse your window CSS/animations
      win.style.top = opts.top;
      win.style.left = opts.left;
      win.style.width = opts.width;
      win.style.height = opts.height;

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

      openWindow(win);
    })
    .catch((err) => console.error("Error loading file:", err))
    .finally(() => {
      refreshDraggable();
    });
}

function openProject(filename, title, options = {}) {
  const opts = { ...windowSizeDefault, ...options };

  fetch(`projects/${filename}`)
    .then((response) => response.text())
    .then((html) => {
      // Create a new window
      const win = document.createElement("div");
      win.className = "window";
      win.style.top = opts.top;
      win.style.left = opts.left;
      win.style.width = opts.width;
      win.style.height = opts.height;

      win.innerHTML = `
        <div class="draggable title-bar">
          <span>${title}</span>
          <button class="expand">></button>
          <button class="close">X</button>
        </div>
        <div class="content" style="overflow:hidden">
        <iframe src="projects/${filename}" style="width:100%; height: 100%; border: none;">
        </iframe>
      `;

      openWindow(win);
    })
    .catch((err) => console.error("Error loading HTML:", err))
    .finally(() => {
      refreshDraggable();
    });
}

function openHTMLWindow(filename, title, options = {}) {
  const opts = { ...windowSizeDefault, ...options };

  fetch(`windows/${filename}`)
    .then((response) => response.text())
    .then((html) => {
      // Create a new window
      const win = document.createElement("div");
      win.className = "window";
      win.style.top = opts.top;
      win.style.left = opts.left;
      win.style.width = opts.width;
      win.style.height = opts.height;

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

      openWindow(win);
    })
    .catch((err) => console.error("Error loading HTML:", err))
    .finally(() => {
      refreshDraggable();
    });
}

function openDirectoryWindow() {}

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

// TIME STUFF
function updateTime() {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  let d = new Date();
  document.getElementById("clock-time").innerText = d.toLocaleString(
    "en-us",
    options
  );
}

const clock = setInterval(() => {
  updateTime();
}, 60000); // Every minute?

updateTime();

// AUTO OPEN CERTAIN WINDOWS ON WEBSITE LOAD?
document.addEventListener("DOMContentLoaded", () => {
  let open_default = true;
  const url = new URL(window.location.href);

  const apps = url.searchParams.getAll("app");
  console.log(apps);
  if (apps && apps.length > 0) {
    open_default = false;
  }

  // Launch each requested app window
  apps.forEach((name) => {
    launch(name);
  });

  // const comma_apps = url.searchParams.get_all("apps");
  // comma_apps.forEach((name) => )

  // By Default open some of these things
  if (open_default) {
    openHTMLWindow("about-me.html", "Start Here", {
      left: "50%",
      top: "50px",
      width: "800px",
      height: "50%",
    });
  }
});

function launch(name) {
  switch (name) {
    case "qyllscape":
      openProject("qyllscape/qyllscape.html", "Qyllscape");
      break;
    case "chess":
    case "crooked-rook":
      loadChess();
      break;
    case "turtle-tile":
      openProject("turtle-tile/turtle-tile.html", "Turtle Tile");
      break;
    case "incre":
      openProject("increbuffed/index.html", "Incremental exp");
      break;
    default:
      break;
  }
}
