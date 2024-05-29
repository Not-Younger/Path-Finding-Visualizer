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

export { Queue, Stack };