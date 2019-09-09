Majit
=====

*Like `magit-status`, but ported to QuickJS*

---

## Status

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
  - [ ] make input.listen() take a stack-ish
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
