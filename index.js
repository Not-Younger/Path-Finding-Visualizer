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
var pathFound = false;

const headerHeight = document.getElementsByTagName('header')[0].clientHeight;
const x = Math.round(document.getElementById('table-container').clientWidth / 25);
const y = Math.round((document.getElementById('table-container').clientHeight - headerHeight) / 25);

// Priority Queue
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
      cell.id = `${i},${j}`;
      cell.addEventListener('click', e => clickable(e));
      cell.addEventListener('mousemove', e => drawable(e));
      cell.addEventListener('mousedown', e => focus(e));
      cell.addEventListener('mouseup', e => focus(e));
      cell.addEventListener('mousemove', e => draggable(e))
      cell.classList.add('empty');
      row.appendChild(cell);
    };
    table.appendChild(row);
  }
  container.appendChild(table);

  // Add start and goal positions
  const startCoors = `${Math.floor(y/2)},${Math.floor(x/4)}`;
  const goalCoors = `${Math.floor(y/2)},${Math.floor(3*x/4)}`;
  const start = document.getElementById(startCoors);
  const goal = document.getElementById(goalCoors);
  start.classList.remove('empty');
  goal.classList.remove('empty');
  start.classList.add('start');
  goal.classList.add('goal');
  startCreated = true;
  goalCreated = true;
  startPosition = startCoors;
  goalPosition = goalCoors;
}

// User controls
function clickable(e) {
  const cell = e.target;
  // Can't draw over start or goal
  if (cell.classList.contains('start') || cell.classList.contains('goal')) return;
  // Make cell an obstacle
  if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('empty');
  } else {
    cell.classList.remove('empty');
    cell.classList.add('obstacle');
  }
}

let previous = null;
function drawable(e) {
  if (!isMouseDown) return;
  if (previous == e.target) return;
  const cell = e.target;
  previous = cell;
  // Can't draw over start or goal
  if (cell.classList.contains('start') || cell.classList.contains('goal')) return;
  // Make cell an obstacle
  if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('empty');
  } else {
    cell.classList.remove('empty');
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

function draggable(e) {
  e.preventDefault();
  if (!isMouseDown) return;
  if (!focusStart && !focusGoal) return;
  const cell = e.target;
  if (focusGoal) {
    if (cell.classList.contains('start')) return;
    const previousGoal = document.getElementById(goalPosition);
    // Reset previous goal to empty
    previousGoal.classList.remove('goal');
    previousGoal.classList.add('empty');
    // Set new goal
    removeClasses(cell.id);
    cell.classList.add('goal');
    goalPosition = cell.id;
  }
  else if (focusStart) {
    if (cell.classList.contains('goal')) return;
    const previousStart = document.getElementById(startPosition);
    // Reset previous start to empty
    previousStart.classList.remove('start');
    previousStart.classList.add('empty');
    // Set new start
    removeClasses(cell.id);
    cell.classList.add('start');
    startPosition = cell.id;
  }
}

// Domain button event listeners
document.getElementById('reset').addEventListener('click', () => {
  const cells = document.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    const cell = cells[i];
    cell.classList.remove('obstacle');
    cell.classList.remove('start');
    cell.classList.remove('goal');
    cell.classList.remove('guess');
    cell.classList.remove('found');
    cell.classList.remove('path');
    cell.classList.add('empty');
  }
  const startCoors = `${Math.floor(y/2)},${Math.floor(x/4)}`;
  const goalCoors = `${Math.floor(y/2)},${Math.floor(3*x/4)}`;
  const start = document.getElementById(startCoors);
  const goal = document.getElementById(goalCoors);
  start.classList.remove('empty');
  goal.classList.remove('empty');
  start.classList.add('start');
  goal.classList.add('goal');
  startCreated = true;
  goalCreated = true;
  startPosition = startCoors;
  goalPosition = goalCoors; 
})

document.getElementById('bfs').addEventListener('click', () => {
  // Check if start and goal exist
  if (startPosition == null || goalPosition == null) return;
  bfs(startPosition, goalPosition);
})

// Algorithms
// Breadth First Search
async function bfs(startCoords, goalCoords) {
  // Map of previous coords
  let cells = {};
  // Queue of string coords
  const q = new Queue();
  // Set guess distance for start
  const start = document.getElementById(startCoords);
  start.classList.add('guess');
  cells[startCoords] = '0';
  q.enqueue(startCoords);
  while (!q.isEmpty) {
    // Get string coords from queue
    const current = q.dequeue();
    // Confirm shortest path
    document.getElementById(current).classList.add('found');
    // Get array coords from string coords
    const currentCoords = getNumberCoords(current);
    // Get neighbor coords
    const neighbors = [
      [currentCoords[0] - 1, currentCoords[1]],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0], currentCoords[1] + 1]
    ];
    const stringNeighbors = [
      getStringCoords(neighbors[0]),
      getStringCoords(neighbors[1]),
      getStringCoords(neighbors[2]),
      getStringCoords(neighbors[3])
    ]
    // Visit neighbors
    for (var i = 0; i < neighbors.length; i++) {
      // Check if neighbor is in the domain
      if (!checkValid(neighbors[i])) continue;
      // Get neighbor element
      const neighbor = document.getElementById(getStringCoords(neighbors[i]));
      // Check if neighbor's path has already been found
      if (neighbor.classList.contains('found')) continue;
      // Check if neighbor is already in the queue
      if (neighbor.classList.contains('guess')) continue;
      // Check if neighbor is goal
      if (stringNeighbors[i] === goalCoords) {
        // Add previous coords
        cells[goalCoords] = current;
        // Display the shortest path
        displayPath(cells, startCoords, goalCoords);
        // Update start styling
        removeClasses(startCoords);
        start.classList.add('start');
        return;
      }
      // Add relevant class
      neighbor.classList.add('guess');
      // Add previous coords
      cells[stringNeighbors[i]] = current;
      // Add neighbor location to queue
      q.enqueue(stringNeighbors[i]);
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  alert('No path found');
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
  if (coords[0] < 0 || coords[0] >= y) return false;
  if (coords[1] < 0 || coords[1] >= x) return false;
  if (cell.classList.contains('obstacle')) return false;
  return true;
}

function removeClasses(id) {
  const cell = document.getElementById(id);
  cell.classList.remove('obstacle');
  cell.classList.remove('goal');
  cell.classList.remove('start');
  cell.classList.remove('empty');
  cell.classList.remove('guess');
  cell.classList.remove('found');
}

async function displayPath(cells, start, goal) {
  let shortestPath = [];
  let current = goal;
  while (current != '0') {
    shortestPath.push(current);
    current = cells[current];
  }
  // Add path class to path
  for (let i = shortestPath.length - 1; i >= 0; i--) {
    if (shortestPath[i] == start) continue;
    if (shortestPath[i] == goal) continue;
    const cell = document.getElementById(shortestPath[i]);
    cell.classList.add('path');
    await new Promise(resolve => setTimeout(resolve, 10)); 
  }
}