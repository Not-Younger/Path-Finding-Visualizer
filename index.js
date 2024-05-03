// Global State
var darkMode = false;
var isMouseDown = false;
// User state
var isEraser = false;
var isObstacle = true;
var isGoal = false;
var isStart = false;
// Domain state
var goalCreated = false;
var goalPosition = null;
var startCreated = false;
var startPosition = null;

const width = 30;
const height = 20;

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
makeDomain(width, height);

// Dark mode function
function toggleDarkMode() {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
    document.getElementsByTagName('table')[0].style.borderColor = 'white';
  } else {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
    document.getElementsByTagName('table')[0].style.borderColor = 'black';
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
function makeDomain(x, y) {
  var container = document.getElementById('table-container');
  var table = document.createElement('table');
  for (var i = 0; i < y; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < x; j++) {
      var cell = document.createElement('td');
      cell.id = `${i},${j}`;
      cell.addEventListener('click', e => clickable(e));
      cell.addEventListener('mousemove', e => draggable(e));
      cell.classList.add('empty');
      row.appendChild(cell);
    };
    table.appendChild(row);
  }
  container.appendChild(table);
}

function clickable(e) {
  const cell = e.target;
  // Check if trying to make another start/goal
  if (isGoal && goalCreated) {alert('Goal already created'); return}
  if (isStart && startCreated) {alert('Start already created'); return}
  // Check if overwritting start/goal
  if (cell.classList.contains('goal')) goalCreated = false;
  if (cell.classList.contains('start')) startCreated = false;
  // Reset cell classes and then add relevant class
  removeClasses(cell.id);
  if (isGoal) {
    cell.classList.add('goal');
    // Update goal existence and position
    goalCreated = true;
    goalPosition = cell.id;
  }
  else if (isStart) {
    cell.classList.add('start');
    // Update start existence and position
    startCreated = true;
    startPosition = cell.id;
  }
  else if (isObstacle) {
    cell.classList.add('obstacle');
  }
  else if (isEraser) {
    cell.classList.add('empty');
  }
}

function draggable(e) {
  if (!isMouseDown) return;

  const cell = e.target;
  if (isGoal || isStart) return;
  // Check if overwritting start/goal
  if (cell.classList.contains('goal')) goalCreated = false;
  if (cell.classList.contains('start')) startCreated = false;
  // Reset cell classes and then add relevant class
  removeClasses(cell.id);
  if (isObstacle) {
    cell.classList.add('obstacle');
  } 
  else if (isEraser) {
    cell.classList.add('empty');
  }
};

// Domain button event listeners
document.getElementById('eraser').addEventListener('click', () => {
  isEraser = true;
  isObstacle = false;
  isStart = false;
  isGoal = false;
})

document.getElementById('obstacle').addEventListener('click', () => {
  isEraser = false;
  isObstacle = true;
  isStart = false;
  isGoal = false;
})

document.getElementById('start-position').addEventListener('click', () => {
  isEraser = false;
  isObstacle = false; 
  isStart = true;
  isGoal = false;
})

document.getElementById('goal-position').addEventListener('click', () => {
  isEraser = false;
  isObstacle = false;
  isStart = false;
  isGoal = true;
})

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
  goalCreated = false;
  startCreated = false;
  goalPosition = null;
  startPosition = null;
})

document.getElementById('bfs').addEventListener('click', async () => {
  const start = getNumberCoords(startPosition);
  const goal = getNumberCoords(goalPosition);

  await bfs(start, goal);
})

// Algorithms
// Breadth First Search
async function bfs(start, end) {
  const startString = getStringCoords(start);
  const endString = getStringCoords(end);
  // Queue of string coords
  const q = new Queue();
  // Set guess distance for start
  document.getElementById(startString).classList.add('guess');
  q.enqueue(startString);

  while (!q.isEmpty) {
    // Get string coords from queue
    const current = q.dequeue();
    // Add shortest path
    document.getElementById(current).classList.add('found');
    // Check if current is the goal
    if (current === endString) {
      alert('Goal Reached!');
      return;
    }
    // Get array coords from string coords
    const currentCoords = getNumberCoords(current);
    // Check neighbors
    const neighbors = [
      [currentCoords[0] - 1, currentCoords[1]],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0], currentCoords[1] + 1]
    ];
    // Visit neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!checkValid(neighbors[i])) continue;
      const neighbor = document.getElementById(getStringCoords(neighbors[i]));
      if (neighbor.classList.contains('found')) continue;
      if (neighbor.classList.contains('guess')) continue;
      // check if neighbor is goal
      if (getStringCoords(neighbors[i]) === endString) {
        alert('Goal Reached!');
        return;
      }
      neighbor.classList.add('guess');
      q.enqueue(getStringCoords(neighbors[i]));
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
  if (coords[0] < 0 || coords[0] >= height) return false;
  if (coords[1] < 0 || coords[1] >= width) return false;
  if (cell.classList.contains('obstacle')) return false;
  return true;
}

function removeClasses(id) {
  const cell = document.getElementById(id);
  cell.classList.remove('obstacle');
  cell.classList.remove('goal');
  cell.classList.remove('start');
  cell.classList.remove('empty');
}