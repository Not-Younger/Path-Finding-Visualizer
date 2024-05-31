import { clickable, drawable, focus, draggable } from './event-handlers.js';
import { removeClasses } from './helpers.js';

class grid {
  constructor(width, height, state) {
    this.width = width;
    this.height = height;
    this.domain;
    this.start;
    this.goal;
    
    // Create HTML domain
    this.constructDomain(state);
    // Create index domain
    this.constructIndexDomain();
    // Set start and goal
    this.createStart();
    this.createGoal();
  }

  constructDomain(state) {
    var container = document.getElementById('table-container');
    var table = document.createElement('table');
    for (var y = this.height-1; y >= 0; y--) {
      var row = document.createElement('tr');
      for (var x = 0; x < this.width; x++) {
        var cell = document.createElement('td');
        cell.id = `${x},${y}`;
        cell.addEventListener('mousedown', e => clickable(e, this, state));
        cell.addEventListener('mousemove', e => drawable(e, state));
        cell.addEventListener('mousedown', e => focus(e, this, state));
        cell.addEventListener('mousemove', e => draggable(e, this, state));
        cell.classList.add('unvisited');
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    container.appendChild(table);
  }

  constructIndexDomain() {
    const domain = [];
    for (let x = 0; x < this.width; x++) {
      const row = [];
      for (let y = 0; y < this.height; y++) {
        row.push(document.getElementById(`${x},${y}`));
      }
      domain.push(row);
    }
    this.domain = domain;
  }

  createStart() {
    this.start = [Math.floor(this.width/4), Math.floor(this.height/2)];
    const start = this.index(this.start);
    start.classList.remove('unvisited');
    start.classList.add('start');
  }

  createGoal() {
    this.goal = [Math.floor(3*this.width/4), Math.floor(this.height/2)];
    const goal = this.index(this.goal);
    goal.classList.remove('unvisited');
    goal.classList.add('goal');
  }

  index(coords) {
    return this.domain[coords[0]][coords[1]];
  }

  checkValid(coords) {
    if (coords[0] < 0 || coords[0] >= this.width) return false;
    if (coords[1] < 0 || coords[1] >= this.height) return false;
    const cell = this.index(coords);
    if (cell.classList.contains('obstacle')) return false;
    return true;
  }

  resetDomain() {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        removeClasses(cell.id);
        cell.classList.add('unvisited');
      }
    }
  }

  resetObstacle() {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        if (cell.classList.contains('obstacle')) {
          removeClasses(cell.id);
          cell.classList.add('unvisited');
        }
      }
    }
  }

  resetVisited() {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        const cell = this.domain[j][i];
        if (cell.classList.contains('obstacle')) continue;
        if (cell.classList.contains('goal')) continue;
        if (cell.classList.contains('start')) continue;
        if (cell.classList.contains('goal-after')) {
          removeClasses(cell.id);
          cell.classList.add('goal');
          continue;
        } else if (cell.classList.contains('start-after')) {
          removeClasses(cell.id);
          cell.classList.add('start');
          continue;
        }
        removeClasses(cell.id);
        cell.classList.add('unvisited');
      }
    }
  }
}

export { grid };