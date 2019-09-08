import * as screen from './screen.js';
import * as input from './input.js';
import * as resizer from './resizer.js';
import * as tty from './tty.js';

tty.setup();
screen.clearScreen();

resizer.listen((width, height) => {
  screen.saveCursorPositionAndAttributes();
  redraw(width, height);
  screen.restoreCursorPositionAndAttributes();
});

input.listen({
  moveUp: () => screen.moveUp(),
  moveRight: () => screen.moveRight(),
  moveDown: () => screen.moveDown(),
  moveLeft: () => screen.moveLeft(),
  char(c) {
    screen.puts(String.fromCharCode(c));
  },
  unhandled(chars) {
    screen.puts('unhandled: ' + chars.join(' '));
  },
});

function redraw(width, height) {
  screen.clearScreen();
  screen.moveToTopLeft();

  print('width =', width);
  print('height =', height);
}
