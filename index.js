var cells = document.getElementsByTagName('td');
var isMouseDown = false;
var isPencil = true;

document.addEventListener('mousedown', () => {
  isMouseDown = true;
})

document.addEventListener('mouseup', () => {
  isMouseDown = false;
})

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    if (isPencil) {
      e.target.style.backgroundColor = 'red';
    } else {
      e.target.style.backgroundColor = 'dodgerblue';
    }
  });
}

document.getElementById('pencil').addEventListener('click', (e) => {
  isPencil = isPencil ? false : true;
  document.getElementById(e.target.id).innerHTML = isPencil ? 'Pencil' : 'Eraser';
  console.log(e.target.id)
})