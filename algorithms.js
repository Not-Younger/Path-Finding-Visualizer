import { Queue, Stack } from './data-structures.js';
import { getStringCoords, displayPath } from './helpers.js';

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

export { bfs, dfs };