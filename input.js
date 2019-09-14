import * as std from 'std';
import * as os from 'os';

function isParamByte(b) {
  return b === 0x3b/* ; */ || (b >= 0x30/* 0 */ && b <= 0x39/* 9 */);
}

function bytesToString(bs) {
  return bs.map(b=>String.fromCharCode(b)).join('');
}

function* stateMachine(listener) {
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
            const [flags,x,y] = bytesToString(paramBytes).split(';').map(n => parseInt(n, 10));

            const typeFlag = (flags >> 5) & 0b11;
            const modFlag = (flags >> 2) & 0b111;
            const buttonFlag = flags & 0b11;

            const event = { type: "mouse", x, y };

            event.mods = {
              ctrl:  !!(modFlag & 0b100),
              alt:   !!(modFlag & 0b010),
              shift: !!(modFlag & 0b001),
            };

            switch (typeFlag) {
              case 3: // scroll
                event.subtype = 'scroll';
                event.by = (flags & 1) ? -1 : 1;
                break;
              case 2: // move
                event.subtype = 'move';
                break;
              case 1: // up/down
                if (buttonFlag === 3) {
                  event.subtype = 'release';
                  // Multiple buttons can be pressed simultaneously,
                  // but they can be released in any order, and the
                  // terminal doesn't tell us anything about which.
                  // But either way, that's buggy in Apple Terminal.
                }
                else {
                  event.subtype = 'press';
                  event.button = buttonFlag;
                }
                break;
            }

            listener.onKey(event);
            break;
          case 0x41: // A = up
            listener.onKey({ type: 'up' });
            break;
          case 0x42: // B = down
            listener.onKey({ type: 'down' });
            break;
          case 0x43: // C = right
            listener.onKey({ type: 'right-arrow', ctrl: paramBytes.length > 0 });
            break;
          case 0x44: // D = left
            listener.onKey({ type: 'left-arrow', ctrl: paramBytes.length > 0 });
            break;
          case 0x5a: // Z = shift-tab (???)
            listener.onKey({ type: 'shift-tab' });
            break;
        }
        // print(bytesToString(paramBytes) + ' = ' + b + ' = ' + b.toString(16))
      }
    }
    else if (b === 0x7f) { // delete
      listener.onKey({ type: "delete" });
    }
    else {
      listener.onKey({ type: 'other', byte: b });
    }
  // print(b);
  }
}

export function listen() {
  let listener = {};
  const machine = stateMachine(listener);
  machine.next();


  os.setReadHandler(std.in, () => {
    const array = new Uint8Array(64);
    const bytesRead = os.read(std.in, array.buffer, 0, array.length);

    const key = Array
      .from(array.slice(0, bytesRead))
      .map(b=>String.fromCharCode(b))
      .join('');

    if (bytesRead === 1 && array[0] === 0x1b) {
      // special-case escape by itself
      listener.onKey({ type: 'escape' });
      return;
    }

    for (let i = 0; i < bytesRead; i++) {
      const b = array[i];
      machine.next(b);
    }

    // print(array.slice(0, bytesRead).toLocaleString() + ' ' + JSON.stringify(key));
  });

  return listener;
}
