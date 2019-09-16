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

/**
 * 
 * - [x] develop 'tty' module
 * - [x] develop 'input' module
 * - [ ] make view manager
 * - [ ] make basic text editor
 * - [ ] imitate magit's "transient" module
 * - [ ] figure out how magic uses git
 * 
 */

import * as std from 'std';
import * as os from 'os';
import * as tty from './r3k/tty.js';
import * as input from './r3k/input.js';

class Glyph {

  constructor(c, styles) {
    this.c = c;
    this.styles = styles;
  }

}

class Buffer {

  constructor(str) {
    this.lines = []; // array of arrays of glyphs
    this.lines.push(str.split('').map(c => new Glyph(c, [])));
  }

}

class View {

  constructor(buffer, x, y, w, h) {
    this.buffer = buffer;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  redraw() {
    tty.setStyles(tty.styles.bg.blue);
    for (let y = this.y; y < this.y + this.h; y++) {
      for (let x = this.x; x < this.x + this.w; x++) {
        if (y === this.y || y === this.y + this.h-1 || x === this.x || x === this.x + this.w-1) {
          tty.moveTo(y, x);
          std.out.puts(' ');
        }
      }
    }
    tty.setStyles(tty.styles.reset);
    std.out.flush();
  }

}

class App {

  setup() {
    tty.setup();

    os.signal(os.SIGINT, () => {
      tty.cleanup();
      std.exit(0);
    });

    this.window = tty.onResize(this.onResize.bind(this));
    this.views = [];

    const inputListener = input.makeListener();
    os.setReadHandler(std.in, inputListener.readHandler);
    inputListener.onInput = this.onInput.bind(this);

    tty.useAltScreen();
    tty.enableMouse();
    tty.enablePaste();
    tty.enableFocus();
    tty.hideCursor();
    std.out.flush();

    this.views.push(new View(
      new Buffer('hello world'),
      1, 1,
      this.window.width, this.window.height
    ));

    this.redrawAll();
  }

  onResize() {
    this.redrawAll();
  }

  onInput(event) {
    print(input.code(event));
    print('key', JSON.stringify(event));
  }

  redrawAll() {
    tty.clearScreen();

    for (const view of this.views) {
      view.redraw();
    }

    tty.moveTo(1, 1);
    std.out.flush();
  }

}

new App().setup();
