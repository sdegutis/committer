import * as std from 'std';
import * as os from 'os';

export const Esc = '\x1b';

export const moveUp                    = `${Esc}[A`;
export const moveDown                  = `${Esc}[B`;
export const moveRight                 = `${Esc}[C`;
export const moveLeft                  = `${Esc}[D`;

export const moveUpBy                  = (lines = 1) => `${Esc}[${lines}A`;
export const moveDownBy                = (lines = 1) => `${Esc}[${lines}B`;
export const moveRightBy               = (lines = 1) => `${Esc}[${lines}C`;
export const moveLeftBy                = (lines = 1) => `${Esc}[${lines}D`;
export const moveTo                    = (line, col) => `${Esc}[${line};${col}H`;

export const moveToTopLeft             = `${Esc}[H`;
export const moveWindowUpOneLine       = `${Esc}D`;
export const moveWindowDownOneLine     = `${Esc}M`;
export const moveToNextLine            = `${Esc}E`;

export const saveCursor                = `${Esc}7`;
export const restoreCursor             = `${Esc}8`;

export const clearLineFromCursorRight  = `${Esc}[0K`;
export const clearLineFromCursorLeft   = `${Esc}[1K`;
export const clearLine                 = `${Esc}[2K`;
export const clearScreenFromCursorDown = `${Esc}[0J`;
export const clearScreenFromCursorUp   = `${Esc}[1J`;
export const clearScreen               = `${Esc}[2J`;

export const useAltScreen              = `${Esc}[?1049h`;
export const useMainScreen             = `${Esc}[?1049l`;

export const hideCursor                = `${Esc}[?25l`;
export const showCursor                = `${Esc}[?25h`;

export const style = {
  reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8,
  fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, },
  bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, },
};

export const color = (...styles) => `${Esc}[${styles.join(';')}m`;

export function setup() {
  // Quit if not usable
  if (!os.isatty(std.out)) {
    throw new Error("Not on a usable terminal!");
  }

  // Needed so that user pressing a key doesn't require newline to flush to app
  os.ttySetRaw(std.out);

  // Use the alt screen
  puts(useAltScreen);

  // Restore main screen on exit
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
  puts(useMainScreen);
  std.exit(code);
}

export function puts(str) {
  std.out.puts(str);
  std.out.flush();
}

export function as(styles, fn) {
  color(...styles);
  fn();
  color(style.reset);
}
