import * as std from 'std';
import * as os from 'os';

export function setup() {
  // Quit if not usable
  if (!os.isatty(std.out)) {
    throw new Error("Not on a usable terminal!");
  }

  // Needed so that user pressing a key doesn't require newline to flush to app
  os.ttySetRaw(std.out);

  // Use the alt screen
  useAltScreen();

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
  useMainScreen();
  std.exit(code);
}

export const Esc = '\x1b';

export function puts(str) {
  std.out.puts(str);
  std.out.flush();
}

export function moveUp(lines = 1)                    { puts(`${Esc}[${lines}A`); }
export function moveDown(lines = 1)                  { puts(`${Esc}[${lines}B`); }
export function moveRight(lines = 1)                 { puts(`${Esc}[${lines}C`); }
export function moveLeft(lines = 1)                  { puts(`${Esc}[${lines}D`); }
export function moveToTopLeft()                      { puts(`${Esc}[H`); }
export function moveTo(line, col)                    { puts(`${Esc}[${line};${col}H`); }
export function moveWindowUpOneLine()                { puts(`${Esc}D`); }
export function moveWindowDownOneLine()              { puts(`${Esc}M`); }
export function moveToNextLine()                     { puts(`${Esc}E`); }

export function saveCursorPositionAndAttributes()    { puts(`${Esc}7`); }
export function restoreCursorPositionAndAttributes() { puts(`${Esc}8`); }

export function clearLineFromCursorRight()           { puts(`${Esc}[0K`); }
export function clearLineFromCursorLeft()            { puts(`${Esc}[1K`); }
export function clearLine()                          { puts(`${Esc}[2K`); }
export function clearScreenFromCursorDown()          { puts(`${Esc}[0J`); }
export function clearScreenFromCursorUp()            { puts(`${Esc}[1J`); }
export function clearScreen()                        { puts(`${Esc}[2J`); }

export function useAltScreen()                       { puts(`${Esc}[?1049h`); }
export function useMainScreen()                      { puts(`${Esc}[?1049l`); }

export function hideCursor()                        { puts(`${Esc}[?25l`); }
export function showCursor()                        { puts(`${Esc}[?25h`); }

export const style = {
  reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8,
  fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, },
  bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, },
};

export function color(...styles) { puts(`${Esc}[${styles.join(';')}m`); }

export function as(styles, fn) {
  color(...styles);
  fn();
  color(style.reset);
}
