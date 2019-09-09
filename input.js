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
          case 65/* Up */:    interpreter.handler().moveUp(); break;
          case 67/* Right */: interpreter.handler().moveRight(); break;
          case 66/* Down */:  interpreter.handler().moveDown(); break;
          case 68/* Left */:  interpreter.handler().moveLeft(); break;
          default:            interpreter.handler().unhandled([27, 91, c]); break;
        }
      }
    }
    else {
      interpreter.handler().char(c);
    }
  }
}

class Interpreter {

  constructor() {
    this.handlers = [];
  }

  push(handler) {
    this.handlers.push(handler);
  }

  pop() {
    return this.handlers.pop();
  }

  handler() {
    return this.handlers[this.handlers.length - 1];
  }

}

export function listen(setupInterpreter) {
  const interpreter = new Interpreter();
  setupInterpreter(interpreter);

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
}
