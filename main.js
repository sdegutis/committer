import * as screen from './screen.js';
import * as tty from './tty.js';
import * as modes from './modes.js';

tty.setup();

modes.setup();
modes.push(mainMode);


function mainMode(window) {
  draw();
  screen.moveTo(5, 3);

  const keyHandlers = {
    upArrow:    () => screen.moveUp(),
    rightArrow: () => screen.moveRight(),
    downArrow:  () => screen.moveDown(),
    leftArrow:  () => screen.moveLeft(),
    char(c) {
      if (c === '\x06'/* ctrl-f */) {
        modes.push(innerMode);
      }
      else {
        screen.as([screen.style.fg.green], () => screen.puts(c));
      }

    },
    unhandled(chars) {
      screen.puts('unhandled: ' + chars.join(' '));
    },
  };

  function draw() {
    screen.clearScreen();

    for (let y = 1; y <= window.height; y++) {
      for (let x = 1; x <= window.width; x++) {
        if (x === 1 || y === 1 || x === window.width || y === window.height) {
          screen.moveTo(y, x);
          screen.as([screen.style.bg.blue], () => screen.puts(' '));
        }
      }
    }

    screen.as([screen.style.fg.red], () => {
      screen.moveTo(3, 3); print('window.width =', window.width);
      screen.moveTo(4, 3); print('window.height =', window.height);
    });
  }


  return {
    draw,
    keyHandlers,
    poppedTo: () => screen.moveTo(5, 3),
  };
}


function innerMode(window) {

  draw();

  function draw() {
    for (let y = 20; y <= 40; y++) {
      for (let x = 20; x <= 40; x++) {
        if (x === 20 || y === 20 || x === 40 || y === 40) {
          screen.moveTo(y, x);
          screen.as([screen.style.bg.green], () => screen.puts(' '));
        }
      }
    }
  }

  const keyHandlers = {
    unhandled: (chars) => { },
    char: (c) => {
      if (c === '\x06') {
        modes.pop();
      }
      else {
        screen.moveTo(21, 21);
        screen.puts(c);
      }
    },
  };

  const leave = () => {
    tty.exit();
  };

  return { draw, keyHandlers, leave };
}
