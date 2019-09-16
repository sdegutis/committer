export function makeListener(): Listener;

interface Listener {
  onInput: (e: Event) => void;
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

// Useful for creating event dispatchers.
// Note: doesn't convey all info (e.g. mouse col/row),
//       only indentifying info e.g. "mouse-down1"
export function code(event: Event): string;
