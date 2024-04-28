// Domain
var cells = document.getElementsByTagName('td');
// Global State
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

// Initialize Domain on load
makeDomain(30, 20);

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
      row.appendChild(cell);
    };
    table.appendChild(row);
  }
  container.appendChild(table);
}

function clickable(e) {
  if (e.target.style.backgroundColor === 'green') goalCreated = false;
  else if (e.target.style.backgroundColor === 'orange') startCreated = false;

  if (isEraser) {
    e.target.style.backgroundColor = 'dodgerblue';
  }
  else if (isObstacle) {
    e.target.style.backgroundColor = 'red';
  }
  else if (isGoal) {
    if (goalCreated) {
      alert('Goal already created');
      return;
    }
    e.target.style.backgroundColor = 'green';
    goalCreated = true;
    goalPosition = e.target.id;
  }
  else if (isStart) {
    if (startCreated) {
      alert('Start already created');
      return;
    }
    e.target.style.backgroundColor = 'orange';
    startCreated = true;
    startPosition = e.target.id;
  };
}

function draggable(e) {
  if (!isMouseDown) return;
  if (e.target.style.backgroundColor === 'green') goalCreated = false;
  else if (e.target.style.backgroundColor === 'orange') startCreated = false;

  if (isObstacle) {
    e.target.style.backgroundColor = 'red';
  } 
  else if (isEraser) {
    e.target.style.backgroundColor = 'dodgerblue';
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
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = "dodgerblue";
  }
  goalCreated = false;
  startCreated = false;
})

document.getElementById('run-algorithm').addEventListener('click', async () => {
  const start = getNumberCoords(startPosition);
  const goal = getNumberCoords(goalPosition);

  await findPath(start, goal);
})

// Algorithms
// Direct path to goal
async function findPath(start, end) {
  current = start;
  while (current[0] !== end[0] || current[1] !== end[1]) {
    if (current[0] < end[0]) {
      current[0]++;
    } else if (current[0] > end[0]) {
      current[0]--;
    } else if (current[1] < end[1]) {
      current[1]++;
    } else if (current[1] > end[1]) {
      current[1]--;
    }
    const currStringCoords = getStringCoords(current);
    document.getElementById(currStringCoords).style.backgroundColor = 'purple';
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  alert('Goal Reached!');
}


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

