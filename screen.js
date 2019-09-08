import * as std from 'std';

export const Esc = '\x1b';

export function puts(str) {
  std.out.puts(str);
  std.out.flush();
}

export function moveCursorUpLines(lines) { puts(`${Esc}[${lines}A`); }
export function moveCursorDownLines(lines) { puts(`${Esc}[${lines}B`); }
export function moveCursorRightLines(lines) { puts(`${Esc}[${lines}C`); }
export function moveCursorLeftLines(lines) { puts(`${Esc}[${lines}D`); }
export function moveCursorToUpperLeftCorner() { puts(`${Esc}[H`); }
export function moveCursorToScreenLocation(line, col) { puts(`${Esc}[${line};${col}H`); }
export function moveWindowUpOneLine() { puts(`${Esc}D`); }
export function moveWindowDownOneLine() { puts(`${Esc}M`); }
export function moveToNextLine() { puts(`${Esc}E`); }
export function saveCursorPositionAndAttributes() { puts(`${Esc}7`); }
export function restoreCursorPositionAndAttributes() { puts(`${Esc}8`); }
export function clearLineFromCursorRight() { puts(`${Esc}[0K`); }
export function clearLineFromCursorLeft() { puts(`${Esc}[1K`); }
export function clearEntireLine() { puts(`${Esc}[2K`); }
export function clearScreenFromCursorDown() { puts(`${Esc}[0J`); }
export function clearScreenFromCursorUp() { puts(`${Esc}[1J`); }
export function clearEntireScreen() { puts(`${Esc}[2J`); }
