import { bfs, dfs } from './algorithms.js';
import { getNumberCoords, getStringCoords, checkValid, resetDomain, resetVisited, removeClasses, displayPath, callAlgorithm } from './helpers.js';

// Global State
var darkMode = false;
var isMouseDown = false;

var focusStart = false;
var focusGoal = false;

// Domain state
var goalPosition = null;
var startPosition = null;
var pathChecked = false;

const headerHeight = document.getElementsByTagName('header')[0].clientHeight;
const gridX = Math.round(document.getElementById('table-container').clientWidth / 25);
const gridY = Math.round((document.getElementById('table-container').clientHeight - headerHeight) / 25);

var algorithm = bfs;
var algorithmRunning = false;
var speedText = 'Fast';
var algorithmSpeed = 10;

// Initialize Domain on load
// makeDomain(gridX, gridY);

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
  isMouseDown = true;
});
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});
document.addEventListener('mouseup', (e) => focus(e));

// Make domain
function makeDomain(width, height) {
  var container = document.getElementById('table-container');
  var table = document.createElement('table');
  for (var i = height-1; i >= 0; i--) {
    var row = document.createElement('tr');
    for (var j = 0; j < width; j++) {
      var cell = document.createElement('td');
      cell.id = `${j},${i}`;
      cell.addEventListener('mousedown', e => clickable(e));
      cell.addEventListener('mousemove', e => drawable(e));
      cell.addEventListener('mousedown', e => focus(e));
      cell.addEventListener('mouseup', e => focus(e));
      cell.addEventListener('mousemove', e => draggable(e));
      cell.classList.add('unvisited');
      row.appendChild(cell);
    };
    table.appendChild(row);
  }
  container.appendChild(table);

  // Add start and goal positions
  const startCoords = `${Math.floor(width/4)},${Math.floor(height/2)}`;
  const goalCoords = `${Math.floor(3*width/4)},${Math.floor(height/2)}`;
  const start = document.getElementById(startCoords);
  const goal = document.getElementById(goalCoords);
  start.classList.remove('unvisited');
  goal.classList.remove('unvisited');
  start.classList.add('start');
  goal.classList.add('goal');
  startPosition = startCoords;
  goalPosition = goalCoords;
}

// User controls
let previous = null;
function clickable(e) {
  e.preventDefault();
  const cell = e.target;
  previous = cell;
  // Can't draw over start or goal, but can recompute path on click
  if (cell.classList.contains('start') || cell.classList.contains('goal') || cell.classList.contains('start-after') || cell.classList.contains('goal-after')) {
    if (pathChecked) {
      resetVisited();
      callAlgorithm(g, algorithm, pathChecked, algorithmSpeed);
    }
  }
  // Make cell an obstacle
  else if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('unvisited');
  } else {
    removeClasses(cell.id);
    cell.classList.add('obstacle');
  }
}

function drawable(e) {
  e.preventDefault();
  if (!isMouseDown) return;
  if (previous == e.target) return;
  if (focusStart || focusGoal) return;
  const cell = e.target;
  previous = cell;
  // Can't draw over start or goal
  if (cell.classList.contains('start') || cell.classList.contains('goal')) return;
  // Make cell an obstacle
  if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('unvisited');
  } else {
    removeClasses(cell.id);
    cell.classList.add('obstacle');
  }
}

function focus(e) {
  if (e.type == 'mouseup') {
    focusStart = false;
    focusGoal = false;
  }
  else if (e.target.id == startPosition) {
    focusStart = true;
    focusGoal = false;
  }
  else if (e.target.id == goalPosition) {
    focusGoal = true;
    focusStart = false;
  }
}

let previousPoint = null;
let previousGoalType = 'unvisited';
let previousStartType = 'unvisited';
function draggable(e) {
  e.preventDefault();
  if (!isMouseDown) return;
  if (!focusStart && !focusGoal) return;
  if (previousPoint === e.target) return;
  if (algorithmRunning) return;

  const cell = e.target;
  if (focusGoal) {
    if (cell.classList.contains('start') || cell.classList.contains('start-after')) return;
    const previousGoal = document.getElementById(goalPosition);
    // Reset previous goal to unvisited
    previousGoal.classList.remove('goal');
    previousGoal.classList.remove('goal-after');
    if (previousGoalType === 'visited') 
      previousGoal.classList.add('visited-instant');
    else
      previousGoal.classList.add(previousGoalType);
    previousGoalType = cell.classList[0];
    // Set new goal
    removeClasses(cell.id);
    cell.classList.add('goal');
    goalPosition = cell.id;
    g.goal = getNumberCoords(goalPosition);
  }
  else if (focusStart) {
    if (cell.classList.contains('goal') || cell.classList.contains('goal-after')) return;
    const previousStart = document.getElementById(startPosition);
    // Reset previous start to unvisited
    previousStart.classList.remove('start');
    previousStart.classList.remove('start-after');
    if (previousStartType === 'visited') {
      previousStart.classList.add('visited-instant');
    } else {
      previousStart.classList.add(previousStartType);
    }
    previousStartType = cell.classList[0];
    // Set new start
    removeClasses(cell.id);
    cell.classList.add('start');
    startPosition = cell.id;
    g.start = getNumberCoords(startPosition);
  }
  if (pathChecked) {
    resetVisited();
    callAlgorithm(g, algorithm, pathChecked, algorithmSpeed);
  }
  previousPoint = cell;
}

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
      speedBtn.innerHTML = `Speed: ${speedText} <i class="icon fa-solid fa-caret-down" style="transform: rotate(180deg)"></i>`;
    }
    else {
      document.getElementById('speeds-container').style.display = 'none';
      speedBtn.innerHTML = `Speed: ${speedText} <i class="icon fa-solid fa-caret-down"></i>`;
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
    speedBtn.innerHTML = `Speed: ${speedText} <i class="icon fa-solid fa-caret-down"></i>`;
  });
});

const algoButtons = document.getElementsByClassName('algo');
for (var i = 0; i < algoButtons.length; i++) {
  algoButtons[i].addEventListener('click', (e) => {
    const algo = e.target.id;
    if (algo == 'bfs') {
      algorithm = bfs;
    } else if (algo == 'dfs') {
      algorithm = dfs;
    }
    document.getElementById('start').innerHTML = `Start ${algo.toUpperCase()}`;
  })
}

const speedButtons = document.getElementsByClassName('speed');
for (var i = 0; i < speedButtons.length; i++) {
  speedButtons[i].addEventListener('click', (e) => {
    const speed = e.target.id;
    if (speed == 'slow') {
      algorithmSpeed = 1000;
    } else if (speed == 'average') {
      algorithmSpeed = 100;
    } else if (speed == 'fast') {
      algorithmSpeed = 10;
    }
    speedText = speed.charAt(0).toUpperCase() + speed.slice(1);
  })
}

// Maze button

document.getElementById('reset').addEventListener('click', () => {
  if (algorithmRunning) return;
  resetDomain();
  const startCoords = `${Math.floor(gridX/4)},${Math.floor(gridY/2)}`;
  const goalCoords = `${Math.floor(3*gridX/4)},${Math.floor(gridY/2)}`;
  const start = document.getElementById(startCoords);
  const goal = document.getElementById(goalCoords);
  start.classList.remove('unvisited');
  goal.classList.remove('unvisited');
  start.classList.add('start');
  goal.classList.add('goal');
  startPosition = startCoords;
  goalPosition = goalCoords;
  pathChecked = false;

  previous = null;
  previousPoint = null;
  previousGoalType = 'unvisited';
  previousStartType = 'unvisited';
});

document.getElementById('start').addEventListener('click', async () => {
  // Check if start and goal exist
  if (startPosition == null || goalPosition == null) return;
  if (algorithmRunning) return;
  algorithmRunning = true;
  pathChecked = false;
  resetVisited();
  callAlgorithm(g, algorithm, pathChecked, algorithmSpeed);
  algorithmRunning = false;
  pathChecked = true;
});

document.getElementById('random').addEventListener('click', () => {
  if (algorithmRunning) return;
  // resetDomain();
  basicRandomMaze(g);
})

function basicRandomMaze(grid) {
  const cells = document.getElementsByTagName('td');
  var numObstacles = Math.floor(grid.width * grid.height / 4);
  while (numObstacles > 0) {
    const cell = cells[Math.floor(Math.random() * cells.length)];
    if (cell.classList.contains('obstacle')) continue;
    if (cell.classList.contains('start') || cell.classList.contains('goal')) continue;
    removeClasses(cell.id);
    cell.classList.add('obstacle');
    numObstacles--;
  }
}

async function addBorderMaze(gridX, gridY) {
  const cells = document.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const coords = getNumberCoords(cell.id);
    if (coords[0] == 0 || coords[0] == gridX - 1 || coords[1] == 0 || coords[1] == gridY - 1) {
      cell.classList.remove('unvisited');
      cell.classList.add('obstacle');
      // await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.domain;
    this.start;
    this.goal;
    
    // Create HTML domain
    this.constructDomain();
    // Create index domain
    this.constructIndexDomain();
    // Set start and goal
    this.createStart();
    this.createGoal();
  }

  constructDomain() {
    var container = document.getElementById('table-container');
    var table = document.createElement('table');
    for (var y = this.height-1; y >= 0; y--) {
      var row = document.createElement('tr');
      for (var x = 0; x < this.width; x++) {
        var cell = document.createElement('td');
        cell.id = `${x},${y}`;
        cell.addEventListener('mousedown', e => clickable(e));
        cell.addEventListener('mousemove', e => drawable(e));
        cell.addEventListener('mousedown', e => focus(e));
        cell.addEventListener('mousemove', e => draggable(e));
        cell.classList.add('unvisited');
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    container.appendChild(table);
  }

  constructIndexDomain() {
    const domain = [];
    for (let x = 0; x < this.width; x++) {
      const row = [];
      for (let y = 0; y < this.height; y++) {
        row.push(document.getElementById(`${x},${y}`));
      }
      domain.push(row);
    }
    this.domain = domain;
  }

  createStart() {
    this.start = [Math.floor(this.width/4), Math.floor(this.height/2)];
    const start = this.index(this.start);
    start.classList.remove('unvisited');
    start.classList.add('start');
    startPosition = getStringCoords(this.start);
  }

  createGoal() {
    this.goal = [Math.floor(3*this.width/4), Math.floor(this.height/2)];
    const goal = this.index(this.goal);
    goal.classList.remove('unvisited');
    goal.classList.add('goal');
    goalPosition = getStringCoords(this.goal);
  }

  index(coords) {
    return this.domain[coords[0]][coords[1]];
  }

  checkValid(coords) {
    if (coords[0] < 0 || coords[0] >= this.width) return false;
    if (coords[1] < 0 || coords[1] >= this.height) return false;
    const cell = this.index(coords);
    if (cell.classList.contains('obstacle')) return false;
    return true;
  }

  resetDomain() {
    console.log(this.domain);
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        removeClasses(cell.id);
        cell.classList.add('unvisited');
      }
    }
  }

  resetObstacle() {
    console.log(this.domain);
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        if (cell.classList.contains('obstacle')) {
          removeClasses(cell.id);
          cell.classList.add('unvisited');
        }
      }
    }
  }

  resetVisited() {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        if (cell.classList.contains('obstacle')) continue;
        if (cell.classList.contains('goal')) continue;
        if (cell.classList.contains('start')) continue;
        if (cell.classList.contains('goal-after')) {
          removeClasses(cell.id);
          cell.classList.add('goal');
          continue;
        } else if (cell.classList.contains('start-after')) {
          removeClasses(cell.id);
          cell.classList.add('start');
          continue;
        }
        removeClasses(cell.id);
        cell.classList.add('unvisited');
      }
    }
  }
}

var g = new grid(gridX, gridY);


// console.log(g.checkValid([38, 28]));
// await new Promise(resolve => setTimeout(resolve, 10000));
// g.resetDomain();
// g.resetObstacle();
// g.resetVisited();

// bfs2(startPosition, goalPosition, gridX, gridY, pathChecked, algorithmSpeed);
// callAlgorithm(bfs, startPosition, goalPosition, gridX, gridY, pathChecked, algorithmSpeed);