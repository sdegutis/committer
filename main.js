import * as screen from './screen.js';
import * as input from './input.js';
import * as resizer from './resizer.js';
import * as tty from './tty.js';

tty.setup();
screen.clearEntireScreen();

resizer.listen((width, height) => {
  screen.saveCursorPositionAndAttributes();
  redraw(width, height);
  screen.restoreCursorPositionAndAttributes();
});

input.listen({
  moveUp: () => screen.moveCursorUpLines(1),
  moveRight: () => screen.moveCursorRightLines(1),
  moveDown: () => screen.moveCursorDownLines(1),
  moveLeft: () => screen.moveCursorLeftLines(1),
  char(c) {
    screen.puts(String.fromCharCode(c));
  },
  unhandled(chars) {
    screen.puts('unhandled: ' + chars.join(' '));
  },
});

function redraw(width, height) {
  screen.clearEntireScreen();
  screen.moveCursorToUpperLeftCorner();

  print('width =', width);
  print('height =', height);
}
