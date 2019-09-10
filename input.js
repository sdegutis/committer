import * as std from 'std';
import * as os from 'os';

function* handleCode(interpreter) {
  while (true) {
    let c = yield;

    if (c === 27/* Esc */) {
      c = yield;
      if (c === 91/* [ */) {
        c = yield;
        switch (c) {
          case 65/* Up */:    interpreter.upArrow();              break;
          case 67/* Right */: interpreter.rightArrow();           break;
          case 66/* Down */:  interpreter.downArrow();            break;
          case 68/* Left */:  interpreter.leftArrow();            break;
          default:            interpreter.unhandled([27, 91, c]); break;
        }
      }
    }
    else {
      interpreter.char(String.fromCharCode(c));
    }
  }
}

const noop = () => {};
const baseHandlers = {
  upArrow:    noop,
  downArrow:  noop,
  rightArrow: noop,
  leftArrow:  noop,
  unhandled:  noop,
  char:       noop,
}

export function listen() {
  const interpreter = {};
  const set = (handlers) => {
    Object.assign(interpreter, baseHandlers);
    Object.assign(interpreter, handlers);
  };
  set({}); // use base handlers

  const gen = handleCode(interpreter);
  gen.next(); // move to the first yield

  os.setReadHandler(std.in, () => {
    const array = new Uint8Array(32);
    const bytesRead = os.read(std.in, array.buffer, 0, array.length);
    for (let i = 0; i < bytesRead; i++) {
      const c = array[i];
      gen.next(c);
    }
  });

  return set;
}
