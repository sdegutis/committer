export function listen(): Listener;

interface Listener {
  onKey: (e: Event) => void;
}

type Event = { type: 'move', where: 'up' | 'down' | 'left' | 'right' }
           | { type: 'paste', str: string }
           | { type: 'control', byte: number, alt?: boolean }
           | { type: 'print', char: string, alt?: boolean }
           | { type: 'delete', alt?: boolean }
           | { type: 'shift-tab' }
           | { type: 'focus' }
           | { type: 'unfocus' }
           | { type: 'mouse', x: number, y: number,
               mods: {
                 ctrl: boolean,
                 alt: boolean,
                 shift: boolean,
               } } &
               ( { subtype: 'scroll', by: 1 | -1 }
               | { subtype: 'move' }
               | { subtype: 'press', button: number }
               | { subtype: 'release' } )
           | { type: 'other', byte: number }
           ;
