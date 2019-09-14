import * as std from 'std';
import * as os from 'os';

const undoers = {
  screen: false,
  cursor: false,
  mouse: false,
  style: false,
};

export const Esc = '\x1b';

export const moveUp           = (lines = 1) => std.out.puts(`${Esc}[${lines}A`);
export const moveDown         = (lines = 1) => std.out.puts(`${Esc}[${lines}B`);
export const moveRight        = (lines = 1) => std.out.puts(`${Esc}[${lines}C`);
export const moveLeft         = (lines = 1) => std.out.puts(`${Esc}[${lines}D`);
export const moveTo           = (line, col) => std.out.puts(`${Esc}[${line};${col}H`);

export const scrollUp         = () => std.out.puts(`${Esc}D`);
export const scrollDown       = () => std.out.puts(`${Esc}M`);
export const moveToNextLine   = () => std.out.puts(`${Esc}E`);

export const saveCursor       = () => std.out.puts(`${Esc}7`);
export const restoreCursor    = () => std.out.puts(`${Esc}8`);

export const clearLineRight   = () => std.out.puts(`${Esc}[0K`);
export const clearLineLeft    = () => std.out.puts(`${Esc}[1K`);
export const clearLine        = () => std.out.puts(`${Esc}[2K`);
export const clearScreenDown  = () => std.out.puts(`${Esc}[0J`);
export const clearScreenUp    = () => std.out.puts(`${Esc}[1J`);
export const clearScreen      = () => std.out.puts(`${Esc}[2J`);

export const useAltScreen     = () => { std.out.puts(`${Esc}[?1049h`); undoers.screen = true; };
export const useMainScreen    = () => { std.out.puts(`${Esc}[?1049l`); undoers.screen = false; };

export const hideCursor       = () => { std.out.puts(`${Esc}[?25l`); undoers.cursor = true; };
export const showCursor       = () => { std.out.puts(`${Esc}[?25h`); undoers.cursor = false; };

export const enableMouse      = () => { std.out.puts(`${Esc}[?1000;1003;1006;1015h`); undoers.mouse = true; };
export const disableMouse     = () => { std.out.puts(`${Esc}[?1000;1003;1006;1015l`); undoers.mouse = false; };

export const styles = {
  reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8,
  fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, },
  bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, },
};

export const setStyles = (...items) => {
  if (items.length === 0) return;
  undoers.style = (items[items.length - 1] !== styles.reset);
  std.out.puts(`${Esc}[${items.join(';')}m`);
};

export function setup() {
  // Quit if not usable
  if (!os.isatty(std.out)) {
    throw new Error("Not on a usable terminal!");
  }

  // React immediately to keys
  os.ttySetRaw(std.out);

  // Cleanup state on exit
  os.signal(os.SIGINT, exit);
}

export function onResize(fn) {
  // Call immediately
  const [width, height] = os.ttyGetWinSize(std.out);
  fn(width, height);

  // Install resize handler
  const SIGWINCH = 28;
  os.signal(SIGWINCH, () => {
    const [width, height] = os.ttyGetWinSize(std.out);
    fn(width, height);
  });
}

export function exit(code = 0) {
  if (undoers.screen) useMainScreen();
  if (undoers.cursor) showCursor();
  if (undoers.mouse) disableMouse();
  if (undoers.style) setStyles(styles.reset);
  std.out.flush();
  std.exit(code);
}
