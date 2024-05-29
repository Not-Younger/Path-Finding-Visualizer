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

function checkValid(coords, gridX, gridY) {
  const cell = document.getElementById(getStringCoords(coords));
  if (coords[0] < 0 || coords[0] >= gridX) return false;
  if (coords[1] < 0 || coords[1] >= gridY) return false;
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

async function displayPath(cells, startCoords, goalCoords, delay) {
  // Get result path
  let resultPath = [];
  let current = goalCoords;
  while (current != '0') {
    resultPath.push(current);
    current = cells[current];
  }
  document.getElementById(startCoords).classList.remove('start');
  document.getElementById(startCoords).classList.add('start-after');
  // Add path class to path
  for (let i = resultPath.length - 1; i >= 0; i--) {
    if (resultPath[i] == startCoords) continue;
    if (resultPath[i] == goalCoords) continue;
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
  document.getElementById(goalCoords).classList.remove('goal');
  document.getElementById(goalCoords).classList.add('goal-after');
}

async function callAlgorithm(algorithm, startPosition, goalPosition, gridX, gridY, pathChecked, delay=0) {
  await algorithm(startPosition, goalPosition, gridX, gridY, pathChecked, delay);
}

export { getNumberCoords, getStringCoords, checkValid, resetDomain, resetVisited, removeClasses, displayPath, callAlgorithm };