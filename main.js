// TODO: The "modes" concept is not quite right yet.
//       It needs to be smarter about redrawing the
//       the whole thing, vs drawing just a portion.
//
//       Potential solution:
//         Use an event handler system for drawing,
//         where drawAll() just fires every event.
//         And when you want to draw one thing, just
//         manually fire that event yourself.


import * as tty from './tty.js';
import * as modes from './modes.js';

tty.setup();

modes.setup();
modes.push(mainMode);


function mainMode(window) {
  draw();
  tty.moveTo(5, 3);

  const keyHandlers = {
    upArrow:    () => tty.moveUp(),
    rightArrow: () => tty.moveRight(),
    downArrow:  () => tty.moveDown(),
    leftArrow:  () => tty.moveLeft(),
    char(c) {
      if (c === '\x06'/* ctrl-f */) {
        modes.push(innerMode);
      }
      else {
        tty.as([tty.style.fg.green], () => tty.puts(c));
      }

    },
    unhandled(chars) {
      tty.puts('unhandled: ' + chars.join(' '));
    },
  };

  function draw() {
    tty.clearScreen();

    for (let y = 1; y <= window.height; y++) {
      for (let x = 1; x <= window.width; x++) {
        if (x === 1 || y === 1 || x === window.width || y === window.height) {
          tty.moveTo(y, x);
          tty.as([tty.style.bg.blue], () => tty.puts(' '));
        }
      }
    }

    tty.as([tty.style.fg.red], () => {
      tty.moveTo(3, 3); print('window.width =', window.width);
      tty.moveTo(4, 3); print('window.height =', window.height);
    });
  }


  return {
    draw,
    keyHandlers,
    poppedTo: () => tty.moveTo(5, 3),
  };
}


function innerMode(window) {

  draw();

  function draw() {
    for (let y = 20; y <= 40; y++) {
      for (let x = 20; x <= 40; x++) {
        if (x === 20 || y === 20 || x === 40 || y === 40) {
          tty.moveTo(y, x);
          tty.as([tty.style.bg.green], () => tty.puts(' '));
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
        tty.moveTo(21, 21);
        tty.puts(c);
      }
    },
  };

  const leave = () => {
    // tty.exit();
  };

  return { draw, keyHandlers, leave };
}
