RETRO 3000
==========

*80s-style CLI API but with modern capabilities (e.g. mouse) and easy API*

---

## Demo

```bash
$ brew install quickjs
$ qjs demo.js
```

Contents of `demo.js`:

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
  print(JSON.stringify(event));
};
```

Sample output:

```
{"type":"print","char":"h"}
{"type":"print","char":"e"}
{"type":"print","char":"l"}
{"type":"print","char":"l"}
{"type":"print","char":"o"}
{"type":"print","char":"w"}
{"type":"delete"}
{"type":"print","char":" "}
{"type":"print","char":"w"}
{"type":"print","char":"o"}
{"type":"print","char":"r"}
{"type":"print","char":"l"}
{"type":"print","char":"d"}
{"type":"print","char":"!"}
{"type":"control","byte":14}
{"type":"control","byte":14}
{"type":"control","byte":16}
{"type":"move","where":"up"}
{"type":"move","where":"left"}
{"type":"move","where":"right"}
{"type":"move","where":"down"}
{"type":"escape"}
{"type":"mouse","x":39,"y":44,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":39,"y":43,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":38,"y":43,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":38,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":37,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":37,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"press","button":0}
{"type":"mouse","x":37,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"release"}
{"type":"unfocus"}
{"type":"focus"}
{"type":"mouse","x":38,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":38,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"press","button":0}
{"type":"mouse","x":39,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":40,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":41,"y":42,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":41,"y":41,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"move"}
{"type":"mouse","x":41,"y":41,"mods":{"ctrl":false,"alt":false,"shift":false},"subtype":"release"}
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
               x: number,
               y: number,
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

// Useful for creating event dispatchers.
// Note: doesn't convey all info (e.g. mouse col/row),
//       only indentifying info e.g. "mouse-down1"
export function code(event: Event): string;
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

## License

MIT, with the request that you think in silence about the meaning of life for an hour sometime this week
