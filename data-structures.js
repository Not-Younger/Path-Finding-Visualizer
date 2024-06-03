// Queue
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

// Stack
class Stack {
  constructor(size) {
    this._size = size
    this._stack = []
  }
  isFull() {
    return (this._stack.length === this._size)
  }
  isEmpty() {
    return (this._stack.length === 0)
  }
  push(item) {
    if (!this.isFull()) {
      this._stack.push(item)
      return true
    }
    return false
  }
  pop() {
    if (!this.isEmpty()) {
      const index = this._stack.indexOf(this._stack[this._stack.length - 1])
      if (index > -1) {
        this._stack.splice(index, 1)
      }
      return true
    }
    return false
  }
  peek() {
    if (!this.isEmpty()) {
      return this._stack[this._stack.length - 1]
    }
    return 'empty'
  }
  getStack() {
    return this._stack
  }
}

// Priority Queue
function compareCoords(a, b) {
  if (a[0] === b[0] && a[1] === b[1]) {
    return true;
  }
  return false;
}

class PriorityQueue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  // element = {warn: number, coords: any}
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    // Find min index
    let min = this.elements[this.head].warn;
    let index = this.head;
    for (let i = this.head; i < this.tail; i++) {
      if (this.elements[i].warn < min) {
        min = this.elements[i].warn;
        index = i;
      }
    }
    // Swap min with head
    const temp = this.elements[this.head];
    this.elements[this.head] = this.elements[index];
    this.elements[index] = temp;
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  decreaseKey(coords, newWarn) {
    for (let i = this.head; i < this.tail; i++) {
      if (compareCoords(this.elements[i].coords, coords)) {
        this.elements[i].warn = newWarn;
        return;
      }
    }
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
  print() {
    for (let i = this.head; i < this.tail; i++) {
      console.log(this.elements[i]);
    }
  }
}

export { Queue, Stack, PriorityQueue };