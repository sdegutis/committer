export function moveUp           (lines = 1): void;
export function moveDown         (lines = 1): void;
export function moveRight        (lines = 1): void;
export function moveLeft         (lines = 1): void;
export function moveTo           (line: number, col: number): void;

export function scrollUp         (): void;
export function scrollDown       (): void;
export function moveToNextLine   (): void;

export function saveCursor       (): void;
export function restoreCursor    (): void;

export function clearLineRight   (): void;
export function clearLineLeft    (): void;
export function clearLine        (): void;
export function clearScreenDown  (): void;
export function clearScreenUp    (): void;
export function clearScreen      (): void;

export function useAltScreen     (): void;
export function useMainScreen    (): void;

export function hideCursor       (): void;
export function showCursor       (): void;

export function enableMouse      (): void;
export function disableMouse     (): void;

export function enablePaste      (): void;
export function disablePaste     (): void;

export function enableFocus      (): void;
export function disableFocus     (): void;

export function setTitle         (title: string): void;

export const styles = {
  reset: 0, bright: 1, dim: 2, underscore: 4, blink: 5, reverse: 7, hidden: 8,
  fg: { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37, },
  bg: { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47, },
};

export function setStyles(...items: number[]): void;

export function setup(): void;

interface Size {
  width: number;
  height: number;
}

export function onResize(fn: () => void): Size;

export function cleanup(): void;
