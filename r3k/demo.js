import * as std from 'std';
import * as os from 'os';
import * as tty from './tty.js';
import * as input from './input.js';

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
  print(JSON.stringify(event));
};
