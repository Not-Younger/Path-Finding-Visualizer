import { removeClasses, random_int } from './helpers.js';

function basicRandomMaze(grid) {
  const cells = document.getElementsByTagName('td');
  var numObstacles = Math.floor(grid.width * grid.height / 4);
  while (numObstacles > 0) {
    const cell = cells[Math.floor(Math.random() * cells.length)];
    if (cell.classList.contains('obstacle')) continue;
    if (cell.classList.contains('start') || cell.classList.contains('goal')) continue;
    removeClasses(cell.id);
    cell.classList.add('obstacle');
    numObstacles--;
  }
}

async function primMaze(grid) {
  const frontiers = [];
  const x = random_int(0, grid.width);
  const y = random_int(0, grid.height);
  frontiers.push([x, y, x, y]);

  while (frontiers.length > 0) {
    const randomIndex = random_int(0, frontiers.length);
    const f = frontiers[randomIndex];
    frontiers.splice(randomIndex, 1);
    const x = f[2];
    const y = f[3];
    if (grid.hasClass([x, y], 'obstacle')) {
      grid.setClass([f[0], f[1]], 'unvisited');
      grid.setClass([x, y], 'unvisited');
      if (( x >= 2) && grid.index([x-2, y], 'obstacle')) {
        frontiers.push([x-1, y, x-2, y]);
      }
      if (( y >= 2) && grid.index([x, y-2], 'obstacle')) {
        frontiers.push([x, y-1, x, y-2]);
      }
      if (( x < grid.width - 2) && grid.index([x+2, y], 'obstacle')) {
        frontiers.push([x+1, y, x+2, y]);
      }
      if (( y < grid.height - 2) && grid.index([x, y+2], 'obstacle')) {
        frontiers.push([x, y+1, x, y+2]);
      }
    }
  }
}

export { basicRandomMaze, primMaze };