/**
 * New concepts
 * ============
 * 
 * **Buffer**
 * 
 *   - A buffer is just an array of lines
 *   - A line is just an array of glyphs
 *   - A glyph is a JS object containing:
 *     - character
 *     - style attributes
 * 
 * **View**
 * 
 *   - A view is a rectangle on screen where the buffer is drawn
 *   - There may be multiple views per buffer at once
 *   - Views may overlap each other, e.g. command palette
 *   - There should be convenient API to split screen into views
 * 
 * **Border**
 * 
 *   - Borders are drawn between views
 *   - Borders are drawn around views if not touching window edge
 * 
 * **Terminal reconciling**
 * 
 *   This concept is needed for two purposes:
 *     1. Draw quickly and efficiently without flickers
 *     2. Avoid needing to describe *how and what* to draw
 * 
 *   It works by looping through each glyph in each view, and only
 *   emitting escape codes and chars needed. This requires that we
 *   keep track of the cursor's attributes. But that's okay since
 *   we're the only ones who set them.
 * 
 * **Configurable styles**
 * 
 *   - The style data in each glyph should be *semantic* names
 *   - Each semantic name should map to an actual style
 *   - The user can then configure styles using CSS-like JSON
 *   - This means easy theming!
 */


import * as tty from './tty.js';
import * as input from './input.js';

tty.setup();

let window = {};

tty.onResize((w, h) => {
  window.width = w;
  window.height = h;
  // tty.puts(tty.clearScreen + tty.moveToTopLeft + w + '\n' + h + '\n');
});

input.listen().onKey = (event, args) => {
  print(event, JSON.stringify(args));

  // switch (c) {
  //   case 'z': tty.puts(tty.moveWindowDownOneLine); break;
  //   case 'x': tty.puts(tty.moveWindowUpOneLine); break;
  //   default: /* tty.puts(c); */ tty.puts(JSON.stringify(c) + '\n');
  // }

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
