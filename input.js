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
          case 65/* Up */:    interpreter.handler.upArrow(); break;
          case 67/* Right */: interpreter.handler.rightArrow(); break;
          case 66/* Down */:  interpreter.handler.downArrow(); break;
          case 68/* Left */:  interpreter.handler.leftArrow(); break;
          default:            interpreter.handler.unhandled([27, 91, c]); break;
        }
      }
    }
    else {
      interpreter.handler.char(c);
    }
  }
}

class Interpreter {

  constructor() {
    this.handlers = [];
    this.handler = null;
  }

  push(handler) {
    this.handlers.push(handler);
    this.handler = handler;
  }

  pop() {
    this.handlers.pop();
    this.handler = this.handlers[this.handlers.length - 1];
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
