import * as std from 'std';
import * as os from 'os';

function* handleCode(handler) {
  while (true) {
    let c = yield;

    if (c === 27/* Esc */) {
      c = yield;
      if (c === 91/* [ */) {
        c = yield;
        switch (c) {
          case 65/* Up */: handler.moveUp(); break;
          case 67/* Right */: handler.moveRight(); break;
          case 66/* Down */: handler.moveDown(); break;
          case 68/* Left */: handler.moveLeft(); break;
          default: handler.unhandled([27, 91, c]); break;
        }
      }
    }
    else {
      handler.char(c);
    }
  }
}

export function listen(callbacks) {
  const gen = handleCode(callbacks);
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
