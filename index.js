import { grid } from './grid.js';
import { bfs, dfs, astar, dijkstra } from './algorithms.js';
import { callAlgorithm } from './helpers.js';
import { state } from './globals.js';
import { focus } from './event-handlers.js';
import { basicRandomMaze, primMaze, basicWeightMaze } from './maze.js';

// Global State
var darkMode = false;

// Get grid dimensions
const headerHeight = document.getElementsByTagName('header')[0].clientHeight;
const gridX = Math.round(document.getElementById('table-container').clientWidth / 25);
const gridY = Math.round((document.getElementById('table-container').clientHeight - headerHeight) / 25);

// Create grid
var g = new grid(gridX, gridY, state);
state.algorithm = bfs;
state.algorithmText = 'BFS';

// Dark mode function
function toggleDarkMode() {
  darkMode = !darkMode;
  if (darkMode) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
}

// Global event listeners
document.addEventListener('mousedown', () => {
  state.isMouseDown = true;
});
document.addEventListener('mouseup', () => {
  state.isMouseDown = false;
});
document.addEventListener('mouseup', (e) => focus(e, g, state));

// Domain button event listeners
document.addEventListener('DOMContentLoaded', () => {
  const algoBtn = document.getElementById('algorithm');
  const mazeBtn = document.getElementById('maze');
  const speedBtn = document.getElementById('speed');
  algoBtn.addEventListener('click', function() {
    this.classList.toggle('closed');
    this.classList.toggle('open');
    mazeBtn.classList.add('closed');
    mazeBtn.classList.remove('open');
    speedBtn.classList.add('closed');
    speedBtn.classList.remove('open');
    if (this.classList.contains('open')) {
      document.getElementById('algorithms-container').style.display = 'block';
      algoBtn.innerHTML = 'Algorithms <i class="icon fa-solid fa-caret-down" style="transform: rotate(180deg)"></i>';
    }
    else {
      document.getElementById('algorithms-container').style.display = 'none';
      algoBtn.innerHTML = 'Algorithms <i class="icon fa-solid fa-caret-down"></i>';
    }
    document.getElementById('mazes-container').style.display = 'none';
    document.getElementById('speeds-container').style.display = 'none';
  });
  mazeBtn.addEventListener('click', function() {
    algoBtn.classList.add('closed');
    algoBtn.classList.remove('open');  
    this.classList.toggle('closed');
    this.classList.toggle('open');
    speedBtn.classList.add('closed');
    speedBtn.classList.remove('open');
    if (this.classList.contains('open')) {
      document.getElementById('mazes-container').style.display = 'block';
      mazeBtn.innerHTML = 'Mazes & Patterns <i class="icon fa-solid fa-caret-down" style="transform: rotate(180deg)"></i>';
    }
    else {
      document.getElementById('mazes-container').style.display = 'none';
      mazeBtn.innerHTML = 'Mazes & Patterns <i class="icon fa-solid fa-caret-down"></i>';
    }
    document.getElementById('algorithms-container').style.display = 'none';
    document.getElementById('speeds-container').style.display = 'none';
  });
  speedBtn.addEventListener('click', function() {
    algoBtn.classList.add('closed');
    algoBtn.classList.remove('open');  
    mazeBtn.classList.add('closed');
    mazeBtn.classList.remove('open');
    this.classList.toggle('closed');
    this.classList.toggle('open');
    if (this.classList.contains('open')) {
      document.getElementById('speeds-container').style.display = 'block';
      speedBtn.innerHTML = `Speed: ${state.algorithmSpeedText} <i class="icon fa-solid fa-caret-down" style="transform: rotate(180deg)"></i>`;
    }
    else {
      document.getElementById('speeds-container').style.display = 'none';
      speedBtn.innerHTML = `Speed: ${state.algorithmSpeedText} <i class="icon fa-solid fa-caret-down"></i>`;
    }
    document.getElementById('algorithms-container').style.display = 'none';
    document.getElementById('mazes-container').style.display = 'none';
  });
  document.addEventListener('click', (e) => {
    if (e.target == algoBtn || e.target == mazeBtn || e.target == speedBtn) return;
    if (e.target.classList.contains('icon')) return;
    algoBtn.classList.add('closed');
    algoBtn.classList.remove('open');
    mazeBtn.classList.add('closed');
    mazeBtn.classList.remove('open');
    speedBtn.classList.add('closed');
    speedBtn.classList.remove('open');
    document.getElementById('algorithms-container').style.display = 'none';
    document.getElementById('mazes-container').style.display = 'none';
    document.getElementById('speeds-container').style.display = 'none';
    algoBtn.innerHTML = 'Algorithms <i class="icon fa-solid fa-caret-down"></i>';
    mazeBtn.innerHTML = 'Mazes & Patterns <i class="icon fa-solid fa-caret-down"></i>';
    speedBtn.innerHTML = `Speed: ${state.algorithmSpeedText} <i class="icon fa-solid fa-caret-down"></i>`;
  });
});

const algoButtons = document.getElementsByClassName('algo');
for (var i = 0; i < algoButtons.length; i++) {
  algoButtons[i].addEventListener('click', (e) => {
    const algo = e.target.id;
    const description = document.getElementById('description');
    if (algo == 'bfs') {
      state.algorithm = bfs;
      state.algorithmText = 'BFS!';
      description.innerHTML = '<p>Breadth-first Search is <strong>unweighted</strong> and <strong>guarantees</strong> the shortest path!</p>';
    } else if (algo == 'dfs') {
      state.algorithm = dfs;
      state.algorithmText = 'DFS!';
      description.innerHTML = '<p>Depth-first Search is <strong>unweighted</strong> and <strong>does not guarantee</strong> the shortest path!</p>';
    } else if (algo == 'astar') {
      state.algorithm = astar;
      state.algorithmText = 'A*!';
      description.innerHTML = '<p>A* Search is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!</p>';
    } else if (algo == 'dijkstra') {
      state.algorithm = dijkstra;
      state.algorithmText = 'Dijkstra\'s!';
      description.innerHTML = '<p>Dijksta\'s Algorithm is <strong>weighted</strong> and <strong>guarantees</strong> the shortest path!</p>';
    }
    document.getElementById('start').innerHTML = `Start ${state.algorithmText}`;
  })
}

const mazeButtons = document.getElementsByClassName('maze');
for (var i = 0; i < mazeButtons.length; i++) {
  mazeButtons[i].addEventListener('click', async (e) => {
    const maze = e.target.id;
    if (maze == 'random') {
      g.resetObstacle();
      g.resetVisited();
      state.pathChecked = false;
      basicRandomMaze(g);
    } else if (maze == 'prim') {
      g.setDomainMaze();
      await primMaze(g);
      g.createStart();
      g.createGoal();
    } else if (maze == 'weight') {
      g.resetObstacle();
      g.resetVisited();
      state.pathChecked = false;
      basicWeightMaze(g);
    }
  })
}

const speedButtons = document.getElementsByClassName('speed');
for (var i = 0; i < speedButtons.length; i++) {
  speedButtons[i].addEventListener('click', (e) => {
    const speed = e.target.id;
    if (speed == 'slow') {
      state.algorithmSpeed = 1000;
    } else if (speed == 'average') {
      state.algorithmSpeed = 100;
    } else if (speed == 'fast') {
      state.algorithmSpeed = 10;
    }
    state.algorithmSpeedText = speed.charAt(0).toUpperCase() + speed.slice(1);
  })
}

document.getElementById('reset').addEventListener('click', () => {
  if (state.algorithmRunning) return;
  g.resetDomain();
  g.createStart();
  g.createGoal();

  state.pathChecked = false;
  state.previousClicked = null;
  state.previousDragged = null;
  state.previousGoalType = 'unvisited';
  state.previousStartType = 'unvisited';
});

document.getElementById('start').addEventListener('click', async () => {
  // Check if start and goal exist
  if (state.algorithmRunning) return;
  state.algorithmRunning = true;
  state.pathChecked = false;
  g.resetVisited();
  await callAlgorithm(g, state.algorithm, state.pathChecked, state.algorithmSpeed);
  state.algorithmRunning = false;
  state.pathChecked = true;
});

document.getElementById('clear').addEventListener('click', () => {
  if (state.algorithmRunning) return;
  g.resetObstacle();
  g.resetVisited();
  state.pathChecked = false;
});
