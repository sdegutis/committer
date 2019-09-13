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

export function listen() {
  let handler = null;

  os.setReadHandler(std.in, () => {
    const array = new Uint8Array(64);
    const bytesRead = os.read(std.in, array.buffer, 0, array.length);
    const key = Array
      .from(array.slice(0, bytesRead))
      .map(b=>String.fromCharCode(b))
      .join('');

    if (handler) handler(key);
  });

  return newHandler => handler = newHandler;
}
