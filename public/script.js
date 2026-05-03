const SIZE = 5;
const PIT_COUNT = 5;

// ── DOM refs ────────────────────────────────────────────────────────────────
const boardEl      = document.getElementById("board");
const statusText   = document.getElementById("statusText");
const perceptsText = document.getElementById("perceptsText");
const inventoryText= document.getElementById("inventoryText");
const overlay      = document.getElementById("overlay");
const overlayIcon  = document.getElementById("overlayIcon");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMsg   = document.getElementById("overlayMsg");
const overlayReset = document.getElementById("overlayReset");

const resetButton = document.getElementById("resetButton");

let state = null;

// ── SVG Sprites ─────────────────────────────────────────────────────────────

const PLAYER_SVG = `
<svg class="player-sprite" viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg" aria-label="Player" role="img">
  <g class="player-float">
    <g class="player-leg player-leg-left">
      <rect x="13.5" y="37" width="5.5" height="5" rx="1" fill="#2e5080"/>
      <rect x="12.5" y="40" width="7" height="2.5" rx="1" fill="#1a1008"/>
    </g>
    <g class="player-leg player-leg-right">
      <rect x="21" y="37" width="5.5" height="5" rx="1" fill="#2e5080"/>
      <rect x="20.5" y="40" width="7" height="2.5" rx="1" fill="#1a1008"/>
    </g>
    <g class="player-arm player-arm-left">
      <path d="M13 24.5 L7 30 L9 31.5 L14.5 27" fill="#3a6aa0"/>
    </g>
    <g class="player-arm player-arm-right">
      <path d="M27 24.5 L33 30 L31 31.5 L25.5 27" fill="#3a6aa0"/>
      <rect x="32" y="22" width="3" height="11" rx="1.2" fill="#6a3808"/>
      <ellipse class="torch-flame torch-flame-outer" cx="33.5" cy="19" rx="4.5" ry="6" fill="rgba(255,140,20,0.55)"/>
      <ellipse class="torch-flame torch-flame-mid" cx="33.5" cy="20" rx="3" ry="4" fill="rgba(255,200,50,0.8)"/>
      <ellipse class="torch-flame torch-flame-inner" cx="33.5" cy="21" rx="1.5" ry="2.5" fill="rgba(255,240,180,0.95)"/>
    </g>
    <g class="player-body">
      <rect x="7" y="10" width="26" height="3.5" rx="1.5" fill="#5a3210"/>
      <rect x="12" y="2" width="16" height="9" rx="2" fill="#7a4418"/>
      <rect x="12" y="9" width="16" height="2" rx="0" fill="#3a1e08"/>
      <circle cx="20" cy="19" r="8.5" fill="#f0b880"/>
      <ellipse cx="20" cy="24" rx="6" ry="3" fill="#d99060" opacity="0.5"/>
      <circle cx="17" cy="18" r="2" fill="#2a1608"/>
      <circle cx="23" cy="18" r="2" fill="#2a1608"/>
      <circle cx="17.7" cy="17.3" r="0.7" fill="rgba(255,255,255,0.7)"/>
      <circle cx="23.7" cy="17.3" r="0.7" fill="rgba(255,255,255,0.7)"/>
      <path d="M16.5 22.5 Q20 25.5 23.5 22.5" stroke="#9a5020" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M13 28 L14.5 24 Q20 27 25.5 24 L27 28 L27 38 L13 38 Z" fill="#3a6aa0"/>
      <rect x="13" y="33" width="14" height="3" rx="1" fill="#6a3808"/>
      <rect x="18" y="32.5" width="4" height="4" rx="0.5" fill="#c89020"/>
      <rect x="19" y="33.5" width="2" height="2" rx="0.2" fill="#8a6010"/>
    </g>
  </g>
</svg>`;

const WUMPUS_SVG = `
<svg class="wumpus-sprite" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-label="Wumpus" role="img">
  <!-- Left horn -->
  <polygon points="10,13 5,1 15,9" fill="#6a0808"/>
  <!-- Right horn -->
  <polygon points="30,13 35,1 25,9" fill="#6a0808"/>
  <!-- Horn highlight -->
  <line x1="8" y1="10" x2="11" y2="4" stroke="#9a1010" stroke-width="1" opacity="0.6"/>
  <line x1="32" y1="10" x2="29" y2="4" stroke="#9a1010" stroke-width="1" opacity="0.6"/>
  <!-- Head -->
  <ellipse cx="20" cy="16" rx="13" ry="11" fill="#a01818"/>
  <!-- Head shading -->
  <ellipse cx="20" cy="13" rx="10" ry="7" fill="#b82020" opacity="0.6"/>
  <!-- Snout -->
  <ellipse cx="20" cy="22" rx="7.5" ry="5" fill="#801010"/>
  <!-- Nostrils -->
  <ellipse cx="17" cy="22" rx="2" ry="1.5" fill="#3a0000"/>
  <ellipse cx="23" cy="22" rx="2" ry="1.5" fill="#3a0000"/>
  <!-- Left eye white -->
  <circle cx="14.5" cy="14" r="4" fill="#ff1a1a"/>
  <!-- Right eye white -->
  <circle cx="25.5" cy="14" r="4" fill="#ff1a1a"/>
  <!-- Pupils -->
  <ellipse cx="14.5" cy="14" rx="2.2" ry="2.8" fill="#000"/>
  <ellipse cx="25.5" cy="14" rx="2.2" ry="2.8" fill="#000"/>
  <!-- Eye glint -->
  <circle cx="15.3" cy="12.8" r="0.9" fill="rgba(255,255,255,0.55)"/>
  <circle cx="26.3" cy="12.8" r="0.9" fill="rgba(255,255,255,0.55)"/>
  <!-- Mouth -->
  <path d="M12.5 26 Q20 31 27.5 26" fill="#3a0000" stroke="#200000" stroke-width="0.5"/>
  <!-- Fangs -->
  <polygon points="15,26 13,32 17.5,27" fill="#f0f0e8"/>
  <polygon points="20,27 18,34 22,34" fill="#f0f0e8"/>
  <polygon points="25,26 22.5,27 27,32" fill="#f0f0e8"/>
  <!-- Body -->
  <ellipse cx="20" cy="35" rx="12" ry="7" fill="#880e0e"/>
  <!-- Claws left -->
  <path d="M8,32 Q3,34 5,38 Q6.5,35.5 9,35" fill="#a01818"/>
  <!-- Claws right -->
  <path d="M32,32 Q37,34 35,38 Q33.5,35.5 31,35" fill="#a01818"/>
</svg>`;

const GOLD_SVG = `
<svg class="gold-sprite" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-label="Gold" role="img">
  <!-- Coin shadow -->
  <ellipse cx="16" cy="29" rx="10" ry="2" fill="rgba(0,0,0,0.35)"/>
  <!-- Coin body -->
  <circle cx="16" cy="15" r="13" fill="#e8a800"/>
  <!-- Coin face highlight -->
  <circle cx="16" cy="15" r="11" fill="#ffd700"/>
  <!-- Inner ring -->
  <circle cx="16" cy="15" r="8.5" fill="none" stroke="#c88800" stroke-width="1.2"/>
  <!-- G letter -->
  <text x="16" y="20" text-anchor="middle" font-size="12" font-weight="900"
        fill="#a06800" font-family="Georgia,serif" letter-spacing="-0.5">G</text>
  <!-- Shine -->
  <ellipse cx="11" cy="10" rx="3.5" ry="2" fill="rgba(255,255,255,0.4)" transform="rotate(-30,11,10)"/>
</svg>`;

function pitHTML() {
  return `<div class="pit-sprite"><div class="pit-inner"></div></div>`;
}

// ── Game state ───────────────────────────────────────────────────────────────

function createWorld() {
  const grid = Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => ({
      row, col,
      pit: false, wumpus: false, gold: false,
      visited: false,
    }))
  );

  const start = { row: SIZE - 1, col: 0 };
  const occupied = new Set([serialize(start.row, start.col)]);

  // Block start neighbors so hazards can't kill the player before any inference
  getNeighbors(start.row, start.col).forEach(([r, c]) => occupied.add(serialize(r, c)));

  placeRandom(grid, occupied, PIT_COUNT, "pit");
  placeRandom(grid, occupied, 1, "wumpus");
  placeRandom(grid, occupied, 1, "gold");

  grid[start.row][start.col].visited = true;

  return {
    grid,
    player: { ...start },
    hasGold: false,
    gameOver: false,
    win: false,
    message: "You enter the dark cave...",
    newCells: new Set(),
  };
}

function placeRandom(grid, occupied, count, key) {
  let placed = 0;
  while (placed < count) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    const id  = serialize(row, col);
    if (occupied.has(id)) continue;
    occupied.add(id);
    grid[row][col][key] = true;
    placed++;
  }
}

function serialize(row, col) { return `${row},${col}`; }

function getNeighbors(row, col) {
  return [[row-1,col],[row+1,col],[row,col-1],[row,col+1]]
    .filter(([r,c]) => r >= 0 && r < SIZE && c >= 0 && c < SIZE);
}

function getCurrentCell() {
  return state.grid[state.player.row][state.player.col];
}

function getPercepts(row, col) {
  const percepts  = [];
  const neighbors = getNeighbors(row, col).map(([r,c]) => state.grid[r][c]);
  if (neighbors.some(c => c.pit))    percepts.push("Breeze");
  if (neighbors.some(c => c.wumpus)) percepts.push("Stench");
  if (state.grid[row][col].gold && !state.hasGold) percepts.push("Glitter");
  return percepts;
}

// ── Movement & actions ───────────────────────────────────────────────────────

function movePlayer(direction) {
  if (state.gameOver) return;

  const deltas = { up:[-1,0], down:[1,0], left:[0,-1], right:[0,1] };
  const [dr, dc] = deltas[direction];
  const nextRow  = state.player.row + dr;
  const nextCol  = state.player.col + dc;

  if (nextRow < 0 || nextRow >= SIZE || nextCol < 0 || nextCol >= SIZE) {
    state.message = "A stone wall blocks your path.";
    render();
    return;
  }

  const wasVisited = state.grid[nextRow][nextCol].visited;
  state.player = { row: nextRow, col: nextCol };
  const cell = getCurrentCell();

  if (!wasVisited) {
    cell.visited = true;
    state.newCells = new Set([serialize(nextRow, nextCol)]);
  } else {
    state.newCells = new Set();
  }

  if (cell.pit) {
    state.gameOver = true;
    state.message  = "You tumbled into a bottomless pit!";
    render();
    showOverlay("pit");
  } else if (cell.wumpus) {
    state.gameOver = true;
    state.message  = "The Wumpus devoured you!";
    render();
    showOverlay("wumpus");
  } else if (state.hasGold && nextRow === SIZE - 1 && nextCol === 0) {
    state.gameOver = true;
    state.win      = true;
    state.message  = "You escaped with the gold!";
    render();
    showOverlay("win");
  } else {
    const percepts = getPercepts(nextRow, nextCol);
    if (percepts.includes("Glitter"))      state.message = "Something glitters nearby...";
    else if (percepts.includes("Stench"))  state.message = "A foul stench fills the air!";
    else if (percepts.includes("Breeze"))  state.message = "You feel a cold breeze...";
    else                                   state.message = "You move deeper into the cave.";
    render();
  }
}

function grabGold() {
  if (state.gameOver) return;
  const cell = getCurrentCell();
  if (!cell.gold || state.hasGold) {
    state.message = "There is no gold here.";
    render();
    return;
  }
  cell.gold     = false;
  state.hasGold = true;
  state.message = "You grab the gold! Now get out!";
  render();
}

// ── Overlay ──────────────────────────────────────────────────────────────────

function showOverlay(type) {
  const data = {
    win:    { icon: "🏆", title: "Victory!",        msg: "You escaped the cave with the gold." },
    pit:    { icon: "🕳️", title: "Fell in a Pit",   msg: "The darkness swallowed you whole."    },
    wumpus: { icon: "💀", title: "Eaten Alive",      msg: "The Wumpus was waiting for you."      },
  }[type];

  overlayIcon.textContent  = data.icon;
  overlayTitle.textContent = data.title;
  overlayMsg.textContent   = data.msg;
  overlay.classList.remove("hidden");
}

// ── Rendering ────────────────────────────────────────────────────────────────

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.setProperty("--board-size", SIZE);

  state.grid.forEach(rowCells => {
    rowCells.forEach(cell => {
      const isPlayer  = cell.row === state.player.row && cell.col === state.player.col;
      const isVisible = cell.visited || isPlayer || state.gameOver;
      const isNew     = state.newCells && state.newCells.has(serialize(cell.row, cell.col));

      // Build class list
      let cls = "cell";
      if (isVisible) cls += " visited"; else cls += " hidden";
      if (isPlayer)  cls += " player";
      if (isNew)     cls += " cell-revealed";
      if (state.gameOver && cell.pit)    cls += " game-over-pit";
      if (state.gameOver && cell.wumpus) cls += " game-over-wumpus";

      const el = document.createElement("article");
      el.className = cls;

      const percepts = isVisible ? getPercepts(cell.row, cell.col) : [];

      // Badge markup
      let badges = "";
      if (percepts.includes("Breeze"))  badges += `<span class="badge badge-breeze">~Breeze</span>`;
      if (percepts.includes("Stench"))  badges += `<span class="badge badge-stench">!Stench</span>`;
      if (percepts.includes("Glitter")) badges += `<span class="badge badge-glitter">*Gold</span>`;

      // Bottom content: sprites
      let bottom = "";

      if (isPlayer) {
        bottom += PLAYER_SVG;
      }

      if (state.gameOver && cell.wumpus) {
        bottom += WUMPUS_SVG;
      }

      if (state.gameOver && cell.gold) {
        bottom += GOLD_SVG;
      }

      if (state.gameOver && cell.pit) {
        bottom += pitHTML();
      }

      el.innerHTML = `
        <div class="cell-top">
          <span class="cell-index">${cell.row + 1},${cell.col + 1}</span>
          <div style="display:flex;flex-wrap:wrap;gap:0.2rem;justify-content:flex-end">${badges}</div>
        </div>
        <div class="cell-bottom">${bottom}</div>
      `;

      boardEl.appendChild(el);
    });
  });
}

function renderStatus() {
  const percepts = getPercepts(state.player.row, state.player.col);
  statusText.textContent    = state.message;
  perceptsText.textContent  = percepts.length ? percepts.join(", ") : "None";
  inventoryText.textContent = state.hasGold   ? "Gold secured!" : "Empty-handed";
}

function render() {
  renderBoard();
  renderStatus();
}

// ── Event wiring ─────────────────────────────────────────────────────────────

resetButton.addEventListener("click", startGame);
overlayReset.addEventListener("click", startGame);

window.addEventListener("keydown", e => {
  const map = { w:"up", a:"left", s:"down", d:"right" };
  if (map[e.key]) { e.preventDefault(); movePlayer(map[e.key]); }
  if (e.key.toLowerCase() === "e") {
    e.preventDefault();
    grabGold();
  }
});

// ── Boot ─────────────────────────────────────────────────────────────────────

function startGame() {
  overlay.classList.add("hidden");
  state = createWorld();
  render();
}

startGame();
