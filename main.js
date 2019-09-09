import * as screen from './screen.js';
import * as tty from './tty.js';
import * as modes from './modes.js';

tty.setup();

modes.setup();
modes.push(mainMode);


function mainMode(width, height) {
  draw(width, height);
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

  function draw(width, height) {
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


  return {
    draw,
    keyHandlers,
    poppedTo: () => screen.moveTo(5, 3),
  };
}


function innerMode() {

  function draw() {

  }

  const keyHandlers = {
    upArrow: () => { },
    rightArrow: () => { },
    downArrow: () => { },
    leftArrow: () => { },
    unhandled: (chars) => { },
    char: (c) => {
      if (c === '\x06') {
        modes.pop();
      }
      else {
        screen.moveToTopLeft();
        screen.puts(c);
      }
    },
  };

  return { draw, keyHandlers };
}
