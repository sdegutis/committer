import * as tty from './tty.js';
import * as input from './input.js';
import * as resizer from './resizer.js';

const modes = [];
let top;
let setInputHandlers;

const window = {};

export function setup() {
  resizer.listen((w, h) => {
    window.width = w;
    window.height = h;

    tty.saveCursorPositionAndAttributes();
    for (const mode of modes) {
      mode.draw();
    }
    tty.restoreCursorPositionAndAttributes();
  });

  setInputHandlers = input.listen();
}

export function push(startMode) {
  top = startMode(window);
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
    top.draw();
    if (top.poppedTo) top.poppedTo();
  }
}
