// Global State
var darkMode = false;
var isMouseDown = false;
// User state
var isObstacle = true;
var isGoal = false;
var isStart = false;

var focusStart = false;
var focusGoal = false;

// Domain state
var goalCreated = false;
var goalPosition = null;
var startCreated = false;
var startPosition = null;
var pathChecked = false;

const headerHeight = document.getElementsByTagName('header')[0].clientHeight;
const x = Math.round(document.getElementById('table-container').clientWidth / 25);
const y = Math.round((document.getElementById('table-container').clientHeight - headerHeight) / 25);

var algorithm = bfs;
var algorithmRunning = false;
var algorithmSpeed = 10;

function callAlgorithm(algo, delay=0) {
  algo(startPosition, goalPosition, delay);
}

// Queue
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

// Stack
class Stack {
  constructor(size) {
    this._size = size
    this._stack = []
  }
  isFull() {
    return (this._stack.length === this._size)
  }
  isEmpty() {
    return (this._stack.length === 0)
  }
  push(item) {
    if (!this.isFull()) {
      this._stack.push(item)
      return true
    }
    return false
  }
  pop() {
    if (!this.isEmpty()) {
      const index = this._stack.indexOf(this._stack[this._stack.length - 1])
      if (index > -1) {
        this._stack.splice(index, 1)
      }
      return true
    }
    return false
  }
  peek() {
    if (!this.isEmpty()) {
      return this._stack[this._stack.length - 1]
    }
    return 'empty'
  }
  getStack() {
    return this._stack
  }
}

// Initialize Domain on load
makeDomain();

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
})
document.addEventListener('mouseup', () => {
  isMouseDown = false;
})

// Make domain
function makeDomain() {
  var container = document.getElementById('table-container');
  var table = document.createElement('table');
  for (var i = y-1; i >= 0; i--) {
    var row = document.createElement('tr');
    for (var j = 0; j < x; j++) {
      var cell = document.createElement('td');
      cell.id = `${j},${i}`;
      cell.addEventListener('mousedown', e => clickable(e));
      cell.addEventListener('mousemove', e => drawable(e));
      cell.addEventListener('mousedown', e => focus(e));
      cell.addEventListener('mouseup', e => focus(e));
      cell.addEventListener('mousemove', e => draggable(e))
      cell.classList.add('unvisited');
      row.appendChild(cell);
    };
    table.appendChild(row);
  }
  container.appendChild(table);

  // Add start and goal positions
  const startCoords = `${Math.floor(x/4)},${Math.floor(y/2)}`;
  const goalCoords = `${Math.floor(3*x/4)},${Math.floor(y/2)}`;
  const start = document.getElementById(startCoords);
  const goal = document.getElementById(goalCoords);
  start.classList.remove('unvisited');
  goal.classList.remove('unvisited');
  start.classList.add('start');
  goal.classList.add('goal');
  startCreated = true;
  goalCreated = true;
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
      callAlgorithm(algorithm);
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
  const cell = e.target;
  if (cell.id == startPosition) {
    focusStart = true;
    focusGoal = false;
  }
  else if (cell.id == goalPosition) {
    focusGoal = true;
    focusStart = false;
  }
  else {
    focusStart = false;
    focusGoal = false;
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
  }
  if (pathChecked) {
    resetVisited();
    callAlgorithm(algorithm);
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
      speedBtn.innerHTML = 'Speed <i class="icon fa-solid fa-caret-down" style="transform: rotate(180deg)"></i>';
    }
    else {
      document.getElementById('speeds-container').style.display = 'none';
      speedBtn.innerHTML = 'Speed <i class="icon fa-solid fa-caret-down"></i>';
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
  })
});

document.getElementById('bfs').addEventListener('click', () => {
  algorithm = bfs;
})

document.getElementById('dfs').addEventListener('click', () => {
  algorithm = dfs;
})

document.getElementById('reset').addEventListener('click', () => {
  resetDomain();
  const startCoords = `${Math.floor(x/4)},${Math.floor(y/2)}`;
  const goalCoords = `${Math.floor(3*x/4)},${Math.floor(y/2)}`;
  const start = document.getElementById(startCoords);
  const goal = document.getElementById(goalCoords);
  start.classList.remove('unvisited');
  goal.classList.remove('unvisited');
  start.classList.add('start');
  goal.classList.add('goal');
  startCreated = true;
  goalCreated = true;
  startPosition = startCoords;
  goalPosition = goalCoords;
  pathChecked = false;

  previous = null;
  previousPoint = null;
  previousGoalType = 'unvisited';
  previousStartType = 'unvisited';
})

document.getElementById('start').addEventListener('click', () => {
  // Check if start and goal exist
  if (startPosition == null || goalPosition == null) return;
  callAlgorithm(algorithm, algorithmSpeed);
})

// Algorithms
// Breadth First Search
async function bfs(startCoords, goalCoords, delay) {
  if (algorithmRunning) return;
  algorithmRunning = true;
  // Map of coords: previous coords
  let cells = {};
  // Queue of string coords
  const q = new Queue();
  // Initialize queue with start
  const start = document.getElementById(startCoords);
  start.classList.add('visited');
  cells[startCoords] = '0';
  q.enqueue(startCoords);
  while (!q.isEmpty) {
    const current = q.dequeue();
    const currentCoords = getNumberCoords(current);
    const neighbors = [
      [currentCoords[0], currentCoords[1] + 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] - 1, currentCoords[1]],
    ];
    // Visit neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!checkValid(neighbors[i])) continue;
      const neighborCoords = getStringCoords(neighbors[i]);
      const neighbor = document.getElementById(neighborCoords);
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      // Check if neighbor is goal
      if (neighborCoords === goalCoords) {
        cells[goalCoords] = current;
        if (!pathChecked)
          displayPath(cells, startCoords, goalCoords, delay);
        else
          displayPath(cells, startCoords, goalCoords, 0);
        start.classList.remove('visited');
        start.classList.remove('visited-instant');
        pathChecked = true;
        algorithmRunning = false;
        return;
      }
      // Visit neighbor
      neighbor.classList.remove('unvisited');
      if (pathChecked)
        neighbor.classList.add('visited-instant');
      else
        neighbor.classList.add('visited');
      cells[neighborCoords] = current;
      q.enqueue(neighborCoords);
      if (!pathChecked)
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  start.classList.remove('visited');
  start.classList.remove('visited-instant');
  algorithmRunning = false;
  pathChecked = true;
}

async function dfs(startCoords, goalCoords, delay) {
  if (algorithmRunning) return;
  algorithmRunning = true;
  // Map of coords: previous coords
  let cells = {};
  // Stack of string coords
  const s = new Stack(x * y);
  // Initialize queue with start
  const start = document.getElementById(startCoords);
  // start.classList.add('visited');
  cells[startCoords] = '0';
  s.push(startCoords);
  while (!s.isEmpty()) {
    const currentStringCoords = s.peek();
    s.pop();
    // Visit current
    const current = document.getElementById(currentStringCoords);
    current.classList.remove('unvisited');
    if (pathChecked)
      current.classList.add('visited-instant');
    else
      current.classList.add('visited');
    // Check if current is goal
    if (currentStringCoords === goalCoords) {
      if (!pathChecked)
        displayPath(cells, startCoords, goalCoords, delay);
      else
        displayPath(cells, startCoords, goalCoords, 0);
      start.classList.remove('visited');
      start.classList.remove('visited-instant');
      pathChecked = true;
      algorithmRunning = false;
      return;
    }
    // Get current number coords and find neighbors
    const currentCoords = getNumberCoords(currentStringCoords);
    const neighbors = [
      [currentCoords[0] - 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] + 1],
    ];
    // Add neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!checkValid(neighbors[i])) continue;
      const neighborStringCoords = getStringCoords(neighbors[i]);
      const neighbor = document.getElementById(neighborStringCoords);
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      s.push(neighborStringCoords);
      cells[neighborStringCoords] = currentStringCoords;
      if (!pathChecked)
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  start.classList.remove('visited');
  start.classList.remove('visited-instant');
  pathChecked = true;
  algorithmRunning = false;
}

// Helper functions
// Turn string coords into array coords
function getNumberCoords(coords) {
  const arrayCoords = coords.split(',').map(Number);
  return arrayCoords;
}
// Turn array coords string coords
function getStringCoords(coords) {
  const stringCoords = coords.join(',');
  return stringCoords;
}

function checkValid(coords) {
  const cell = document.getElementById(getStringCoords(coords));
  if (coords[0] < 0 || coords[0] >= x) return false;
  if (coords[1] < 0 || coords[1] >= y) return false;
  if (cell.classList.contains('obstacle')) return false;
  return true;
}

function resetDomain() {
  const cells = document.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    const cell = cells[i];
    removeClasses(cell.id);
    cell.classList.add('unvisited');
  }
}

function resetVisited() {
  const cells = document.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.classList.contains('obstacle')) continue;
    if (cell.classList.contains('goal')) continue;
    if (cell.classList.contains('start')) continue;
    if (cell.classList.contains('goal-after')) {
      removeClasses(cell.id);
      cell.classList.add('goal');
    } else if (cell.classList.contains('start-after')) {
      removeClasses(cell.id);
      cell.classList.add('start');
    } else {
      removeClasses(cell.id);
      cell.classList.add('unvisited');
    }
  }
}

function removeClasses(id) {
  const cell = document.getElementById(id);
  cell.classList.remove('obstacle');
  cell.classList.remove('goal');
  cell.classList.remove('start');
  cell.classList.remove('visited');
  cell.classList.remove('visited-instant');
  cell.classList.remove('unvisited');
  cell.classList.remove('path');
  cell.classList.remove('path-instant');
  cell.classList.remove('start-after');
  cell.classList.remove('goal-after');
}

async function displayPath(cells, start, goal, delay) {
  // Get result path
  let resultPath = [];
  let current = goal;
  while (current != '0') {
    resultPath.push(current);
    current = cells[current];
  }
  document.getElementById(start).classList.remove('start');
  document.getElementById(start).classList.add('start-after');
  // Add path class to path
  for (let i = resultPath.length - 1; i >= 0; i--) {
    if (resultPath[i] == start) continue;
    if (resultPath[i] == goal) continue;
    const cell = document.getElementById(resultPath[i]);
    cell.classList.remove('visited');
    cell.classList.remove('visited-instant');
    if (delay != 0) {
      cell.classList.add('path');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    else {
      cell.classList.add('path-instant');
    }
  }
  document.getElementById(goal).classList.remove('goal');
  document.getElementById(goal).classList.add('goal-after');
}

