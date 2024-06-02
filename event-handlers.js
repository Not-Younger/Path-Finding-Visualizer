import { removeClasses, getStringCoords, getNumberCoords, callAlgorithm } from './helpers.js';

// User controls
function clickable(e, grid, state) {
  e.preventDefault();
  if (state.algorithmRunning) return;
  const cell = e.target;
  state.previousClicked = cell;
  // Can't draw over start or goal, but can recompute path on click
  if (cell.classList.contains('start') || cell.classList.contains('goal') || cell.classList.contains('start-after') || cell.classList.contains('goal-after')) {
    if (state.pathChecked) {
      grid.resetVisited();
      callAlgorithm(grid, state.algorithm, state.pathChecked, state.algorithmSpeed);
    }
  }
  // Make cell an obstacle
  else if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('unvisited');
  } else {
    removeClasses(cell.id);
    cell.classList.add('obstacle');
  }
}

function drawable(e, state) {
  e.preventDefault();
  if (!state.isMouseDown) return;
  if (state.previousClicked == e.target) return;
  if (state.focusStart || state.focusGoal) return;
  if (state.algorithmRunning) return;
  const cell = e.target;
  state.previousClicked = cell;
  // Can't draw over start or goal
  if (cell.classList.contains('start') || cell.classList.contains('goal') || cell.classList.contains('start-after') || cell.classList.contains('goal-after')) return;
  // Make cell an obstacle
  if (cell.classList.contains('obstacle')) {
    cell.classList.remove('obstacle');
    cell.classList.add('unvisited');
  } else {
    removeClasses(cell.id);
    cell.classList.add('obstacle');
  }
}

function focus(e, grid, state) {
  if (e.type == 'mouseup') {
    state.focusStart = false;
    state.focusGoal = false;
  }
  else if (e.target.id == grid.start) {
    state.focusStart = true;
    state.focusGoal = false;
  }
  else if (e.target.id == grid.goal) {
    state.focusStart = false;
    state.focusGoal = true;
  }
}

function draggable(e, grid, state) {
  e.preventDefault();
  if (!state.isMouseDown) return;
  if (!state.focusStart && !state.focusGoal) return;
  if (state.previousDragged === e.target) return;
  if (state.algorithmRunning) return;

  const cell = e.target;
  const cellCoords = getNumberCoords(cell.id);
  if (state.focusGoal) {
    if (cell.classList.contains('start') || cell.classList.contains('start-after')) return;
    const previousGoalStringCoords = getStringCoords(grid.goal);
    const previousGoal = document.getElementById(previousGoalStringCoords);
    // Reset previous goal to unvisited
    previousGoal.classList.remove('goal');
    previousGoal.classList.remove('goal-after');
    if (state.previousGoalType === 'visited') 
      previousGoal.classList.add('visited-instant');
    else
      previousGoal.classList.add(state.previousGoalType);
    state.previousGoalType = cell.classList[0];
    // Set new goal
    removeClasses(cell.id);
    cell.classList.add('goal');
    grid.goal = cellCoords;
  }
  else if (state.focusStart) {
    if (cell.classList.contains('goal') || cell.classList.contains('goal-after')) return;
    const previousStartStringCoords = getStringCoords(grid.start);
    const previousStart = document.getElementById(previousStartStringCoords);
    // Reset previous start to unvisited
    previousStart.classList.remove('start');
    previousStart.classList.remove('start-after');
    if (state.previousStartType === 'visited') {
      previousStart.classList.add('visited-instant');
    } else {
      previousStart.classList.add(state.previousStartType);
    }
    state.previousStartType = cell.classList[0];
    // Set new start
    removeClasses(cell.id);
    cell.classList.add('start');
    grid.start = cellCoords;
  }
  if (state.pathChecked) {
    grid.resetVisited();
    callAlgorithm(grid, state.algorithm, state.pathChecked, state.algorithmSpeed);
  }
  state.previousDragged = cell;
}

export { clickable, drawable, focus, draggable };