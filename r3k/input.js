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
              col: x,
              row: y,
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
                  // In my experience, simultaneous button presses is
                  // buggy in Apple Terminal. Not sure if it's their
                  // fault or my code, but either way it's not exactly
                  // a super useful UI interaction. The xterm man page
                  // recommends using mode 1006 instead of 1015 which
                  // does give us more information about which button
                  // was released, but I already coded this to work with
                  // 1015, and haven't run into any bugs with it (yet).
                }
                else {
                  event.subtype = 'press';
                  event.button = buttonFlag;
                }
                break;
            }

            listener.onInput(event);
            break;
          }
          case 0x41: // A = up
            listener.onInput({ type: 'move', where: 'up' });
            break;
          case 0x42: // B = down
            listener.onInput({ type: 'move', where: 'down' });
            break;
          case 0x43: { // C = right
            const event = { type: 'move', where: 'right' };
            if (paramBytes.length > 0) event.ctrl = true;
            listener.onInput(event);
            break;
          }
          case 0x44: { // D = left
            const event = { type: 'move', where: 'left' };
            if (paramBytes.length > 0) event.ctrl = true;
            listener.onInput(event);
            break;
          }
          case 0x5a: // Z = shift-tab (???)
            listener.onInput({ type: 'shift-tab' });
            break;
          case 0x7e: {// ~
            // we assume paramBytes === "200~"
            let buffer = '';
            while (!buffer.endsWith('\x1b[201~')) {
              buffer += String.fromCharCode(yield);
            }
            const pasted = buffer.slice(0, -6);
            listener.onInput({ type: 'paste', str: pasted });
            break;
          }
          case 0x4f: {
            listener.onInput({ type: 'unfocus' });
            break;
          }
          case 0x49: {
            listener.onInput({ type: 'focus' });
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
      listener.onInput(maybeWithAlt({ type: 'control', byte: b }));
    }
    else if (b >= 0x20 && b <= 0x7e) {
      listener.onInput(maybeWithAlt({ type: 'print', char: String.fromCharCode(b) }));
    }
    else if (b === 0x7f) { // delete
      listener.onInput(maybeWithAlt({ type: "delete" }));
    }
    else {
      listener.onInput({ type: 'other', byte: b });
    }
  // print(b);
  }
}

export function makeListener() {
  let listener = {};
  const machine = stateMachine(listener);
  machine.next();

  listener.readHandler = () => {
    const array = new Uint8Array(64);
    const bytesRead = os.read(std.in, array.buffer, 0, array.length);

    const key = Array
      .from(array.slice(0, bytesRead))
      .map(b=>String.fromCharCode(b))
      .join('');

    if (bytesRead === 1 && array[0] === 0x1b) {
      // special-case escape by itself
      listener.onInput({ type: 'escape' });
      return;
    }

    for (let i = 0; i < bytesRead; i++) {
      const b = array[i];
      const backupBy = machine.next(b).value;
      if (backupBy) {
        i += backupBy;
        machine.next(); // push machine forward
      }
    }

    // print(array.slice(0, bytesRead).toLocaleString() + ' ' + JSON.stringify(key));
  };

  return listener;
}

export function code(event) {
  switch (event.type) {
    case 'move':
      return event.where;
    case 'shift-tab':
      return 'S-tab';
    case 'delete':
      return (event.alt ? 'M-' : '') + 'delete';
    case 'paste':
    case 'escape':
    case 'focus':
    case 'unfocus':
    case 'other':
      return event.type;
    case 'control': {
      let prefix = 'C-';
      if (event.alt) prefix += 'M-';
      return prefix + (event.byte === 0
        ? 'space'
        : String.fromCharCode(event.byte - 1 + 97));
    }
    case 'print': {
      let prefix = '';
      if (event.alt) prefix = 'M-';
      if (event.char === ' ') return prefix + 'space';
      return prefix + event.char;
    }
    case 'mouse': {
      let prefix = '';
      if (event.mods.ctrl)  prefix += 'C-';
      if (event.mods.alt)   prefix += 'M-';
      if (event.mods.shift) prefix += 'S-';
      prefix += 'mouse-';
      switch (event.subtype) {
        case 'scroll':  return prefix + (event.by > 0 ? 'scrollup' : 'scrolldown');
        case 'move':    return prefix + 'move';
        case 'release': return prefix + 'up';
        case 'press':   return prefix + (event.button === 0 ? 'down1' : 'down2');
      }
    }
  }
}
