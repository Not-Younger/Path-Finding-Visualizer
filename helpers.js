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
  cell.classList.remove('warn');
  cell.classList.remove('warn-instant');
  cell.classList.remove('weight');
}

async function displayPath(grid, cells, delay) {
  const startCoords = grid.start;
  const goalCoords = grid.goal;
  const startStringCoords = getStringCoords(startCoords);
  const goalStringCoords = getStringCoords(goalCoords);

  // Get result path
  let resultPath = [];
  let current = goalStringCoords;
  while (current != '0') {
    resultPath.push(current);
    current = cells[current];
  }
  document.getElementById(startStringCoords).classList.remove('start');
  document.getElementById(startStringCoords).classList.add('start-after');
  // Add path class to path
  for (let i = resultPath.length - 1; i >= 0; i--) {
    if (resultPath[i] == startStringCoords) continue;
    if (resultPath[i] == goalStringCoords) continue;
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
  document.getElementById(goalStringCoords).classList.remove('goal');
  document.getElementById(goalStringCoords).classList.add('goal-after');
}

async function callAlgorithm(grid, algorithm, pathChecked, delay=0) {
  await algorithm(grid, pathChecked, delay);
}

const random_int = (m, M) => m + Math.floor(Math.random() * (M - m))

export { getNumberCoords, getStringCoords, removeClasses, displayPath, callAlgorithm, random_int };