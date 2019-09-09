import * as screen from './screen.js';
import * as input from './input.js';
import * as resizer from './resizer.js';

const modes = [];
let top;
let setInputHandlers;

let width;
let height;

export function setup() {
  resizer.listen((w, h) => {
    width = w;
    height = h;
    screen.saveCursorPositionAndAttributes();
    top && top.draw(width, height);
    screen.restoreCursorPositionAndAttributes();
  });

  setInputHandlers = input.listen();
}

export function push(startMode) {
  top = startMode(width, height);
  modes.push(top);

  setInputHandlers(top.keyHandlers);
  // calling the fn itself can draw and handle pushed-to logic
}

export function pop() {
  const old = modes.pop();

  if (old.leave) old.leave();

  top = modes[modes.length - 1]; // ok to be undefined

  if (top) {
    setInputHandlers(top.keyHandlers);
    top.draw(width, height);
    if (top.poppedTo) top.poppedTo();
  }
}
