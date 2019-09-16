Committer
=========

*Like `magit-status`, but ported to QuickJS as a stand-alone executable*

---

## Sub-modules developed in making this

- [RETRO 3000](./r3k/README.md): *80s-style CLI API but with modern capabilities (e.g. mouse) and easy API*

## Status

- [x] develop 'tty' module
- [x] develop 'input' module
- [ ] make view manager
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
