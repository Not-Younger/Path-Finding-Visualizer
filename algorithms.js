import { Queue, Stack } from './data-structures.js';
import { getNumberCoords, getStringCoords, checkValid, displayPath } from './helpers.js';

// Algorithms
// Breadth First Search
async function bfs(startCoords, goalCoords, gridX, gridY, pathChecked, delay) {
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
      if (!checkValid(neighbors[i], gridX, gridY)) continue;
      const neighborCoords = getStringCoords(neighbors[i]);
      const neighbor = document.getElementById(neighborCoords);
      if (neighbor.classList.contains('visited') || neighbor.classList.contains('visited-instant')) continue;
      // Check if neighbor is goal
      if (neighborCoords === goalCoords) {
        cells[goalCoords] = current;
        if (!pathChecked)
          await displayPath(cells, startCoords, goalCoords, delay);
        else
          await displayPath(cells, startCoords, goalCoords, 0);
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
      cells[neighborCoords] = current;
      q.enqueue(neighborCoords);
      if (!pathChecked)
        await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  start.classList.remove('visited');
  start.classList.remove('visited-instant');
}

async function dfs(startCoords, goalCoords, gridX, gridY, pathChecked, delay) {
  // Map of coords: previous coords
  let cells = {};
  // Stack of string coords
  const s = new Stack(gridX * gridY);
  // Initialize queue with start
  const start = document.getElementById(startCoords);
  // start.classList.add('visited');
  cells[startCoords] = '0';
  s.push(startCoords);
  while (!s.isEmpty()) {
    const currentStringCoords = s.peek();
    s.pop();
    const current = document.getElementById(currentStringCoords);
    // Check if current is goal
    if (currentStringCoords === goalCoords) {
      if (!pathChecked)
        await displayPath(cells, startCoords, goalCoords, delay);
      else
        await displayPath(cells, startCoords, goalCoords, 0);
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
    const currentCoords = getNumberCoords(currentStringCoords);
    const neighbors = [
      [currentCoords[0] - 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] - 1],
      [currentCoords[0] + 1, currentCoords[1]],
      [currentCoords[0], currentCoords[1] + 1],
    ];
    // Add neighbors
    for (var i = 0; i < neighbors.length; i++) {
      if (!checkValid(neighbors[i], gridX, gridY)) continue;
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
}

export { bfs, dfs };