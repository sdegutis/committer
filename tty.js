import * as std from 'std';
import * as os from 'os';

const undo = {
  screen: false,
  cursor: false,
  mouse: false,
  style: false,
  paste: false,
  focus: false,
};

export function moveUp           (lines = 1) { std.out.puts(`\x1b[${lines}A`); }
export function moveDown         (lines = 1) { std.out.puts(`\x1b[${lines}B`); }
export function moveRight        (lines = 1) { std.out.puts(`\x1b[${lines}C`); }
export function moveLeft         (lines = 1) { std.out.puts(`\x1b[${lines}D`); }
export function moveTo           (line, col) { std.out.puts(`\x1b[${line};${col}H`); }

export function scrollUp         () { std.out.puts(`\x1bD`); }
export function scrollDown       () { std.out.puts(`\x1bM`); }
export function moveToNextLine   () { std.out.puts(`\x1bE`); }

export function saveCursor       () { std.out.puts(`\x1b7`); }
export function restoreCursor    () { std.out.puts(`\x1b8`); }

export function clearLineRight   () { std.out.puts(`\x1b[0K`); }
export function clearLineLeft    () { std.out.puts(`\x1b[1K`); }
export function clearLine        () { std.out.puts(`\x1b[2K`); }
export function clearScreenDown  () { std.out.puts(`\x1b[0J`); }
export function clearScreenUp    () { std.out.puts(`\x1b[1J`); }
export function clearScreen      () { std.out.puts(`\x1b[2J`); }

export function useAltScreen     () { std.out.puts(`\x1b[?1049h`); undo.screen = true; }
export function useMainScreen    () { std.out.puts(`\x1b[?1049l`); undo.screen = false; }

export function hideCursor       () { std.out.puts(`\x1b[?25l`); undo.cursor = true; }
export function showCursor       () { std.out.puts(`\x1b[?25h`); undo.cursor = false; }

export function enableMouse      () { std.out.puts(`\x1b[?1000;1003;1006;1015h`); undo.mouse = true; }
export function disableMouse     () { std.out.puts(`\x1b[?1000;1003;1006;1015l`); undo.mouse = false; }

export function enablePaste      () { std.out.puts(`\x1b[?2004h`); undo.paste = true; }
export function disablePaste     () { std.out.puts(`\x1b[?2004l`); undo.paste = false; }

export function enableFocus      () { std.out.puts(`\x1b[?1004h`); undo.focus = true; }
export function disableFocus     () { std.out.puts(`\x1b[?1004l`); undo.focus = false; }

export function setTitle         (title) { std.out.puts(`\x1b]0;${title}\x1b\\`); }

export const styles = {
  reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8,
  fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, },
  bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, },
};

export function setStyles(...items) {
  if (items.length === 0) return;
  undo.style = (items[items.length - 1] !== styles.reset);
  std.out.puts(`\x1b[${items.join(';')}m`);
}

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
  const size = {};

  const [width, height] = os.ttyGetWinSize(std.out);
  size.width = width;
  size.height = height;

  const SIGWINCH = 28;
  os.signal(SIGWINCH, () => {
    const [width, height] = os.ttyGetWinSize(std.out);
    size.width = width;
    size.height = height;
    fn();
  });

  return size;
}

export function exit(code = 0) {
  if (undo.screen) useMainScreen();
  if (undo.cursor) showCursor();
  if (undo.mouse) disableMouse();
  if (undo.style) setStyles(styles.reset);
  if (undo.paste) disablePaste();
  if (undo.focus) disableFocus();
  std.out.flush();
  std.exit(code);
}
