import * as std from 'std';
import * as os from 'os';

export const keys = {
  esc:       '\x1b',
  up:        '\x1b[A',
  down:      '\x1b[B',
  left:      '\x1b[D',
  right:     '\x1b[C',
  ctrlLeft:  '\x1b[1;5D',
  ctrlRight: '\x1b[1;5C',
  tab:       '\t',
  shiftTab:  '\x1b[Z',
  ctrlSpace: '\0',
  enter:     '\r',
  newline:   '\n',
  delete:    '\x7f',
};

function isParamByte(b) {
  return b === 0x3b/* ; */ || (b >= 0x30/* 0 */ && b <= 0x39/* 9 */);
}

function bytesToString(bs) {
  return bs.map(b=>String.fromCharCode(b)).join('');
}

function* stateMachine() {
  while (true) {
    let b = yield;
    if (b === 0x1b) { // <ESC>
      b = yield;
      if (b === 0x5b) { // <ESC>[ (CSI)
        const paramBytes = [];
        for (b = yield; isParamByte(b); b = yield) {
          paramBytes.push(b);
        }
        switch (b) {
          case 0x4d: // M = mouse event
            // print("mouse event");
            break;
          case 0x41: // A = up
            break;
          case 0x42: // B = down
            break;
          case 0x43: // C = right
            break;
          case 0x44: // D = left
            break;
          case 0x5a: // Z = shift-tab (???)
            break;
        }
        // print(bytesToString(paramBytes) + ' = ' + b + ' = ' + b.toString(16))
      }
      else if (b === 0x7f) { // delete

      }
    }
    // print(b);
  }
}

export function listen() {

  const machine = stateMachine();
  machine.next();

  // let listener = {};

  os.setReadHandler(std.in, () => {
    const array = new Uint8Array(64);
    const bytesRead = os.read(std.in, array.buffer, 0, array.length);

    const key = Array
      .from(array.slice(0, bytesRead))
      .map(b=>String.fromCharCode(b))
      .join('');

    if (bytesRead === 1 && array[0] === 0x1b) {
      // special-case escape by itself
      print('escape');
      return;
    }

    for (let i = 0; i < bytesRead; i++) {
      const b = array[i];
      machine.next(b);
    }

    // print(array.slice(0, bytesRead).toLocaleString() + ' ' + JSON.stringify(key));

    // if (listener.onKey) {
    //   listener.onKey(key);
    // }
  });

  return {};
}
