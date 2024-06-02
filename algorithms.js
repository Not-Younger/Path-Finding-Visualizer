import { Queue, Stack } from './data-structures.js';
import { getStringCoords, getNumberCoords, displayPath } from './helpers.js';

// Algorithms
// Breadth First Search
async function bfs(grid, pathChecked, delay) {
  const startCoords = grid.start;
  const goalCoords = grid.goal;
  const startStringCoords = getStringCoords(startCoords);
  const goalStringCoords = getStringCoords(goalCoords);
  // Map of coords: previous coords
  let cells = {};
  // Queue of string coords
  const q = new Queue();
  // Initialize queue with start
  const start = document.getElementById(startStringCoords);
  const goal = document.getElementById(goalStringCoords);
  start.classList.add('visited');
  cells[startStringCoords] = '0';
  q.enqueue(startCoords);
  while (!q.isEmpty) {
    const currentCoords = q.dequeue();
    const currentStringCoords = getStringCoords(currentCoords);
    const neighbors = [
      [currentCoords[0], currentCoords[1] + 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] - 1, currentCoords[1]],
    ];
    // Visit neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!grid.checkValid(neighbors[i])) continue;
      const neighborStringCoords = getStringCoords(neighbors[i]);
      const neighbor = document.getElementById(neighborStringCoords);
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      // Check if neighbor is goal
      if (neighbor === goal) {
        cells[goalStringCoords] = currentStringCoords;
        if (!pathChecked)
          await displayPath(grid, cells, delay);
        else
          await displayPath(grid, cells, 0);
        start.classList.remove('visited');
        start.classList.remove('visited-instant');
        return;
      }
      // Visit neighbor
      neighbor.classList.remove('unvisited');
      if (pathChecked)
        neighbor.classList.add('visited-instant');
      else
        neighbor.classList.add('visited');
      cells[neighborStringCoords] = currentStringCoords;
      q.enqueue(neighbors[i]);
      if (!pathChecked)
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  start.classList.remove('visited');
  start.classList.remove('visited-instant');
}

// Depth First Search
async function dfs(grid, pathChecked, delay) {
  const startCoords = grid.start;
  const goalCoords = grid.goal;
  const startStringCoords = getStringCoords(startCoords);
  const goalStringCoords = getStringCoords(goalCoords);
  // Map of coords: previous coords
  let cells = {};
  // Stack of string coords
  const s = new Stack(grid.width * grid.height);
  // Initialize queue with start
  const start = document.getElementById(startStringCoords);
  const goal = document.getElementById(goalStringCoords);
  cells[startStringCoords] = '0';
  s.push(startCoords);
  while (!s.isEmpty()) {
    const currentCoords = s.peek();
    const currentStringCoords = getStringCoords(currentCoords);
    s.pop();
    const current = document.getElementById(currentStringCoords);
    // Check if current is goal
    if (current === goal) {
      if (!pathChecked)
        await displayPath(grid, cells, delay);
      else
        await displayPath(grid, cells, 0);
      start.classList.remove('visited');
      start.classList.remove('visited-instant');
      return;
    }
    // Visit current
    current.classList.remove('unvisited');
    if (pathChecked)
      current.classList.add('visited-instant');
    else
      current.classList.add('visited');
    // Get current number coords and find neighbors
    const neighbors = [
      [currentCoords[0] - 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] + 1],
    ];
    // Add neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!grid.checkValid(neighbors[i])) continue;
      const neighborStringCoords = getStringCoords(neighbors[i]);
      const neighbor = document.getElementById(neighborStringCoords);
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      s.push(neighbors[i]);
      cells[neighborStringCoords] = currentStringCoords;
      if (!pathChecked)
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  start.classList.remove('visited');
  start.classList.remove('visited-instant');
}

function distanceStart(coords, startCoords) {
  return Math.abs(coords[0] - startCoords[0]) + Math.abs(coords[1] - startCoords[1]);
}

function distanceGoal(coords, goalCoords) {
  return Math.abs(coords[0] - goalCoords[0]) + Math.abs(coords[1] - goalCoords[1]);
}

function getMinF(cells) {
  let minF = Infinity;
  let minCoords = null;
  for (var coords in cells) {
    if (cells[coords].f < minF) {
      minF = cells[coords].f;
      minCoords = coords;
    }
    if (cells[coords].f === minF) {
      if (cells[coords].h < cells[minCoords].h)
        minCoords = coords;
    }
  }
  return getNumberCoords(minCoords);
}

// A* Search
async function astar(grid, pathChecked, delay) {
  const startCoords = grid.start;
  const goalCoords = grid.goal;
  const cells = {};
  cells[startCoords] = { g: distanceStart(startCoords, startCoords), h: distanceGoal(startCoords, goalCoords), f: distanceStart(startCoords, startCoords) + distanceGoal(startCoords, goalCoords)};
  console.log(cells);
  while (cells) {
    const currentCoords = getMinF(cells);
    const current = document.getElementById(getStringCoords(currentCoords));
    current.classList.add('visited');
    if (current === document.getElementById(getStringCoords(goalCoords))) {
      // await displayPath(grid, cells, delay);
      console.log('found!');
      return;
    }
    delete cells[currentCoords];
    const neighbors = [
      [currentCoords[0], currentCoords[1] + 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] - 1, currentCoords[1]],
    ];
    for (var i = 0; i < neighbors.length; i++) {
      if (!grid.checkValid(neighbors[i])) continue;
      const neighborCoords = neighbors[i];
      const neighbor = document.getElementById(getStringCoords(neighborCoords));
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      const g = distanceStart(neighborCoords, startCoords);
      const h = distanceGoal(neighborCoords, goalCoords);
      const f = g + h;
      cells[neighborCoords] = { g, h, f };
    }
    if (!pathChecked)
      await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.log('not found');
}



export { bfs, dfs, astar };