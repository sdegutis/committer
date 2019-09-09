import * as std from 'std';
import * as os from 'os';
import * as screen from './screen.js';

export function setup() {
  // Quit if not usable
  if (!os.isatty(std.out)) {
    throw new Error("Not on a usable terminal!");
  }

  // Needed so that user pressing a key doesn't require newline to flush to app
  os.ttySetRaw(std.out);

  // Use the alt screen
  screen.useAltScreen();

  // Restore main screen on exit
  os.signal(os.SIGINT, () => {
    screen.useMainScreen();
    std.exit(0);
  });
}
