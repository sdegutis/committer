import * as std from 'std';
import * as os from 'os';

function isParamByte(b) {
  return b === 0x3b/* ; */ || (b >= 0x30/* 0 */ && b <= 0x39/* 9 */);
}

function bytesToString(bs) {
  return bs.map(b=>String.fromCharCode(b)).join('');
}

function* stateMachine(listener) {
  let alt = false;

  function maybeWithAlt(e) {
    if (alt) {
      e.alt = true;
      alt = false;
    }
    return e;
  }

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
          case 0x4d: { // M = mouse event
            const [flags,x,y] = bytesToString(paramBytes).split(';').map(n => parseInt(n, 10));

            const typeFlag = (flags >> 5) & 0b11;
            const modFlag = (flags >> 2) & 0b111;
            const buttonFlag = flags & 0b11;

            const event = {
              type: "mouse",
              x, y,
              mods: {
                ctrl:  !!(modFlag & 0b100),
                alt:   !!(modFlag & 0b010),
                shift: !!(modFlag & 0b001),
              },
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
          }
          case 0x41: // A = up
            listener.onKey({ type: 'move', where: 'up' });
            break;
          case 0x42: // B = down
            listener.onKey({ type: 'move', where: 'down' });
            break;
          case 0x43: { // C = right
            const event = { type: 'move', where: 'right' };
            if (paramBytes.length > 0) event.ctrl = true;
            listener.onKey(event);
            break;
          }
          case 0x44: { // D = left
            const event = { type: 'move', where: 'left' };
            if (paramBytes.length > 0) event.ctrl = true;
            listener.onKey(event);
            break;
          }
          case 0x5a: // Z = shift-tab (???)
            listener.onKey({ type: 'shift-tab' });
            break;
          case 0x7e: {// ~
            // we assume paramBytes === "200~"
            let buffer = '';
            while (!buffer.endsWith('\x1b[201~')) {
              buffer += String.fromCharCode(yield);
            }
            const pasted = buffer.slice(0, -6);
            listener.onKey({ type: 'paste', str: pasted });
            break;
          }
          case 0x4f: {
            listener.onKey({ type: 'unfocus' });
            break;
          }
          case 0x49: {
            listener.onKey({ type: 'focus' });
            break;
          }
          default:
            print('unhandled escape code', paramBytes, b, b.toString(16));
        }
        // print(bytesToString(paramBytes) + ' = ' + b + ' = ' + b.toString(16))
      }
      else {
        alt = true;
        yield -1;
      }
    }
    else if (b >= 0x00 && b <= 0x1f) {
      listener.onKey(maybeWithAlt({ type: 'control', byte: b }));
    }
    else if (b >= 0x20 && b <= 0x7e) {
      listener.onKey(maybeWithAlt({ type: 'print', char: String.fromCharCode(b) }));
    }
    else if (b === 0x7f) { // delete
      listener.onKey(maybeWithAlt({ type: "delete" }));
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
      const backupBy = machine.next(b).value;
      if (backupBy) {
        i += backupBy;
        // can't really exit, may need tty cleanup etc
        if (i < 0) print("Error! Escape code state machine backed up too far!");
        machine.next(); // push it forward
      }
    }

    print(array.slice(0, bytesRead).toLocaleString() + ' ' + JSON.stringify(key));
  });

  return listener;
}
