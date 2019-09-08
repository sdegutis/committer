import * as os from 'os';
import * as std from 'std';
import * as screen from './screen.js';
import * as input from './input.js';
import * as resizer from './resizer.js';
import * as tty from './tty.js';

tty.setup();
screen.useAltScreen();
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
    screen.as([screen.style.fg.green], () => {
      screen.puts(String.fromCharCode(c));
    });
  },
  unhandled(chars) {
    screen.puts('unhandled: ' + chars.join(' '));
  },
});

function redraw(width, height) {
  screen.clearScreen();

  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      if (x === 1 || y === 1 || x === width || y === height) {
        screen.moveTo(y, x);
        screen.as([screen.style.bg.blue], () => screen.puts(' '));
      }
    }
  }

  screen.as([screen.style.fg.red], () => {
    screen.moveTo(3, 3); print('width =', width);
    screen.moveTo(4, 3); print('height =', height);
  });
}

screen.moveTo(5, 3);

os.signal(os.SIGINT, () => {
  screen.useMainScreen();
  std.exit(0);
});
