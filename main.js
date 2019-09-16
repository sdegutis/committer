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


import * as std from 'std';
import * as os from 'os';
import * as tty from './r3k/tty.js';
import * as input from './r3k/input.js';

tty.setup();

os.signal(os.SIGINT, () => {
  tty.cleanup();
  std.exit(0);
});

tty.useAltScreen();
tty.enableMouse();
tty.enablePaste();
tty.enableFocus();
tty.hideCursor();
tty.clearScreen();
std.out.flush();

const window = tty.onResize(() => {
  print('resized', window.width, window.height);
});

const inputListener = input.makeListener();
os.setReadHandler(std.in, inputListener.readHandler);
inputListener.onInput = (event) => {
  print(input.code(event));
  // print('key', JSON.stringify(event));
};
