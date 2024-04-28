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
  const cell = e.target;
  if (cell.classList.contains('goal')) goalCreated = false;
  else if (cell.classList.contains('start')) startCreated = false;

  cell.classList.remove('obstacle');
  cell.classList.remove('goal');
  cell.classList.remove('start');

  if (isObstacle) {
    cell.style.backgroundColor = 'red';
    cell.classList.add('obstacle');
  }
  else if (isGoal) {
    if (goalCreated) {
      alert('Goal already created');
      return;
    }
    cell.style.backgroundColor = 'green';
    cell.classList.add('goal');
    goalCreated = true;
    goalPosition = cell.id;
  }
  else if (isStart) {
    if (startCreated) {
      alert('Start already created');
      return;
    }
    cell.style.backgroundColor = 'orange';
    cell.classList.add('start');
    startCreated = true;
    startPosition = cell.id;
  }
  else if (isEraser) {
    cell.style.backgroundColor = 'dodgerblue';
  }
}

function draggable(e) {
  if (!isMouseDown) return;

  const cell = e.target;
  if (cell.classList.contains('goal')) goalCreated = false;
  else if (cell.classList.contains('start')) startCreated = false;

  cell.classList.remove('obstacle');
  cell.classList.remove('goal');
  cell.classList.remove('start');

  if (isObstacle) {
    cell.style.backgroundColor = 'red';
    cell.classList.add('obstacle');
  } 
  else if (isEraser) {
    cell.style.backgroundColor = 'dodgerblue';
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
    cells[i].classList.remove('obstacle');
    cells[i].classList.remove('goal');
    cells[i].classList.remove('start');
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
  var currX = start[0];
  var currY = start[1];
  var endX = end[0];
  var endY = end[1];

  while (currX !== endX || currY !== endY) {
    if (currX > endX && currY < endY) {
      // move up and left
      currX--;
      currY++;
    }
    else if (currX < endX && currY < endY) {
      // move down and left
      currX++;
      currY++;
    }
    else if (currX < endX && currY > endY) {
      // move down and right
      currX++;
      currY--;
    }
    else if (currX > endX && currY > endY) {
      // move up and right
      currX--;
      currY--;
    }
    else if (currX > endX) {
      // move up
      currX--;
    }
    else if (currX < endX) {
      // move down
      currX++;
    }
    else if (currY > endY) {
      // move right
      currY--;
    }
    else if (currY < endY) {
      // move left
      currY++;
    }
    const currStringCoords = getStringCoords([currX, currY]);
    document.getElementById(currStringCoords).style.backgroundColor = 'purple';
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  alert('Goal Reached!');
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