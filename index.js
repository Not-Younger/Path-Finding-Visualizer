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


document.addEventListener('mousedown', () => {
  isMouseDown = true;
})

document.addEventListener('mouseup', () => {
  isMouseDown = false;
})

// Dragging
for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    if (e.target.style.backgroundColor === 'green') goalCreated = false;
    else if (e.target.style.backgroundColor === 'orange') startCreated = false;

    if (isObstacle) {
      e.target.style.backgroundColor = 'red';
    } 
    else if (isEraser) {
      e.target.style.backgroundColor = 'dodgerblue';
    }
  });
}

// Clicking
for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (e) => {
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
    }
  })
}

// Eraser
document.getElementById('eraser').addEventListener('click', () => {
  isEraser = true;
  isObstacle = false;
  isStart = false;
  isGoal = false;
})

// Obstacle
document.getElementById('obstacle').addEventListener('click', () => {
  isEraser = false;
  isObstacle = true;
  isStart = false;
  isGoal = false;
})

// Start
document.getElementById('start').addEventListener('click', () => {
  isEraser = false;
  isObstacle = false; 
  isStart = true;
  isGoal = false;
})

// Goal
document.getElementById('goal').addEventListener('click', () => {
  isEraser = false;
  isObstacle = false;
  isStart = false;
  isGoal = true;
})

// Reset
document.getElementById('reset').addEventListener('click', () => {
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = "dodgerblue";
  }
  goalCreated = false;
  startCreated = false;
})

// Path: straight
async function bestPath (start, end) {
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

// Run
document.getElementById('run').addEventListener('click', async () => {
  const start = getNumberCoords(startPosition);
  const goal = getNumberCoords(goalPosition);

  await bestPath(start, goal);
})

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