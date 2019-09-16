Committer
=========

*Like `magit-status`, but ported to QuickJS as a stand-alone executable*

---

## Status

I guess I'm more of an API builder than an app builder, so in trying to create this little command-line app, I ended up creating a few APIs instead.

## API Demo

```typescript
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
  print('key', JSON.stringify(event));
};
```

## Modules

### `input`

#### Usage

```typescript
// create listener
const inputListener = input.makeListener();

// set key handler
inputListener.onKey = (event) => {
  switch (event.type) {
    case 'mouse': {
      // ...
      break;
    }
    case 'move': {
      // ...
      break;
    }
    // ...
  }
};

// register it
os.setReadHandler(std.in, inputListener.readHandler);

// un-register it
os.setReadHandler(std.in, null);
```

#### API

```typescript
export function makeListener(): Listener;

interface Listener {
  onKey: (e: Event) => void;
  readHandler: () => void;
}

type Event = { type: 'move', where: 'up' | 'down' | 'left' | 'right' }
           | { type: 'mouse',
               col: number,
               row: number,
               mods: {
                 ctrl:  boolean,
                 alt:   boolean,
                 shift: boolean,
               } } &
               ( { subtype: 'scroll', by: 1 | -1    }
               | { subtype: 'move'                  }
               | { subtype: 'press', button: number }
               | { subtype: 'release'               } )
           | { type: 'control', byte: number, alt?: boolean }
           | { type: 'print',   char: string, alt?: boolean }
           | { type: 'delete',                alt?: boolean }
           | { type: 'paste',   str: string }
           | { type: 'shift-tab'            }
           | { type: 'escape'               }
           | { type: 'focus'                }
           | { type: 'unfocus'              }
           | { type: 'other', byte: number  }
           ;
```

### `tty`

#### Usage

```typescript
// do this first
tty.setup();

// make sure to cleanup before exiting!
os.signal(os.SIGINT, () => {
  tty.cleanup();
  std.exit(0);
});

// set all the modes you want
tty.useAltScreen();
tty.enableMouse();
tty.enablePaste();
tty.enableFocus();
tty.hideCursor();
std.out.flush(); // nothing automatically flushes

// do stuff
tty.clearScreen();
tty.moveRight();
tty.moveDown();
tty.setStyles(tty.styles.bg.cyan, tty.styles.fg.black, tty.styles.underscore);
std.out.puts("Hello world!");
std.out.flush(); // remember to flush!
```

#### API

```typescript
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
```

## "Committer" Status

- [x] send escape codes
- [x] handle window resizing
- [x] handle raw input
- [x] convenient colorizing
- [ ] make scrollable boxes
- [ ] make boxes overlappable
- [ ] make something like magit's transient
  - [ ] map flags to arguments
  - [ ] map characters to commands
  - [ ] handle invalid characters
  - [x] make input.listen() take a stack-ish
- [ ] wait for os.exec() in QuickJS
- [ ] wrap os.exec() for convenience
- [ ] figure out the extra args magit means by `"..."`
- [ ] figure out how magit reads `git status -z --porcelain`
- [ ] figure out how magit gets diffs
- [ ] figure out how magit maps diffs to regions
- [ ] figure out how magit stages changes
- [ ] figure out how magit unstages changes
- [ ] figure out how magit discards regions
- [ ] figure out how magit discards files

## License

MIT, with the request that you think in silence about the meaning of life for an hour sometime this week
