import * as std from 'std';
import * as os from 'os';

export function setup() {
  if (!os.isatty(std.out)) {
    throw new Error("Not on a usable terminal!");
  }

  // Needed so that user pressing a key doesn't require newline to flush to app
  os.ttySetRaw(std.out);
}
