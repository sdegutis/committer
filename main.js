import * as tty from './tty.js';
import * as modes from './modes.js';
import * as input from './input.js';

tty.setup();


tty.onResize((w, h) => {
  tty.puts(tty.clearScreen + tty.moveToTopLeft + w + '\n' + h + '\n');
});

const listener = input.listen();

listener.onKey = (c) => {

  switch (c) {
    case 'z': tty.puts(tty.moveDown); break;
    case 'x': tty.puts(tty.moveRight); break;
    default: tty.puts(c);
  }

};



// modes.setup();
// modes.push(mainMode);


// function mainMode(window) {
//   draw();
//   tty.moveTo(5, 3);

//   const keyHandler = (c) => {
//     switch (c) {
//       case input.keys.up:       tty.moveUp();           break;
//       case input.keys.right:    tty.moveRight();        break;
//       case input.keys.down:     tty.moveDown();         break;
//       case input.keys.left:     tty.moveLeft();         break;
//       case '\x06'/* ctrl-f */:  modes.push(innerMode);  break;
//       case 'z': tty.color(tty.style.fg.red);            break;
//       case 'x': tty.color(tty.style.fg.yellow);         break;
//       default: tty.puts(c);
//     }
//   };

//   function draw() {
//     tty.clearScreen();

//     for (let y = 1; y <= window.height; y++) {
//       for (let x = 1; x <= window.width; x++) {
//         if (x === 1 || y === 1 || x === window.width || y === window.height) {
//           tty.moveTo(y, x);
//           tty.as([tty.style.bg.blue], () => tty.puts(' '));
//         }
//       }
//     }

//     tty.as([tty.style.fg.red], () => {
//       tty.moveTo(3, 3); print('window.width =', window.width);
//       tty.moveTo(4, 3); print('window.height =', window.height);
//     });
//   }


//   return {
//     draw,
//     keyHandler,
//     poppedTo: () => tty.moveTo(5, 3),
//   };
// }


// function innerMode(window) {

//   draw();

//   function draw() {
//     for (let y = 20; y <= 40; y++) {
//       for (let x = 20; x <= 40; x++) {
//         if (x === 20 || y === 20 || x === 40 || y === 40) {
//           tty.moveTo(y, x);
//           tty.as([tty.style.bg.green], () => tty.puts(' '));
//         }
//       }
//     }
//   }

//   const keyHandler = (c) => {
//     if (c === '\x06') {
//       modes.pop();
//     }
//     else {
//       tty.moveTo(21, 21);
//       tty.puts(c);
//     }
//   };

//   const leave = () => {
//     // tty.exit();
//   };

//   return { draw, keyHandler, leave };
// }
