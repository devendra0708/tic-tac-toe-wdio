# Gameplay — test cases

**Screen:** Play view (`view-play`) — 3×3 board vs computer  
**Spec:** `test/specs/game.spec.ts`  
**IDs:** `[GAME-NNN]`

---

## UI under test (from product)

- Status (`status` + `data-status`): `your-turn` · `computer-thinking` · `human` · `computer` · `draw`
- Board (`board`): cells `cell-0`…`cell-8` with `data-state=empty|x|o`
- Human = **X**, computer = **O**
- Controls: **New Game** (`btn-new`), **Hint** (`btn-hint`), **Reset** (`btn-reset`)
- Hint: `.is-hint` on suggested empty cell
- Win: `.is-win` on winning line

---

## All possible Gameplay cases

| ID | Title | Type | Expected | Auto |
|----|-------|------|----------|------|
| GAME-001 | Place X; computer replies O; occupied locked | Functional | Cell `x` disabled; one `o` if game continues | ✓ |
| GAME-002 | New Game and Reset clear board | Functional | All empty; `your-turn` | ✓ |
| GAME-003 | Hint highlights empty cell | Functional | ≥1 `.is-hint` | ✓ |
| GAME-004 | Finish updates status, history, profile | Functional | Terminal status; ≥1 history row; W+L+D ≥ 1 | ✓ |
| GAME-005 | Initial board empty | Functional | 9× `empty`; `your-turn` | ✓ |
| GAME-006 | Computer thinking status | Functional | Brief `computer-thinking` after move | ✓ |
| GAME-007 | Occupied cell not clickable | Negative | X/O cells disabled | ✓ (in 001) |
| GAME-008 | Cells disabled while busy | Negative | Empties disabled during computer turn | ✓ |
| GAME-009 | Cells disabled after game over | Negative | All disabled on win/loss/draw | ✓ |
| GAME-010 | Human win status | Functional | `data-status=human`; “You win!” | ✓ |
| GAME-011 | Winning cells highlighted | Functional | Exactly 3 `.is-win` | ✓ |
| GAME-012 | Computer win status | Functional | `data-status=computer`; “Computer wins.” | ✓ |
| GAME-013 | Draw status | Functional | `data-status=draw`; “Draw.” | ✓ |
| GAME-014 | Win via row / column / diagonal | Functional | Highlighted cells form a valid win line | ✓ |
| GAME-015 | New Game after finished | Functional | Fresh board; can play again | ✓ |
| GAME-016 | Hint mid-game | Functional | Hint on empty legal cell | ✓ |
| GAME-017 | Hint disabled when not your turn | Negative | Disabled while thinking / over | ✓ |
| GAME-018 | Hint fades after timeout | Edge | `.is-hint` removed ~1.5s | ✓ |
| GAME-019 | Double-click same empty cell | Edge | Only one X placed | ✓ |
| GAME-020 | Status copy matches status attr | Functional | Text and `data-status` aligned | ✓ |
| GAME-021 | Board has 9 cells only | Functional | `cell-0`…`cell-8` | ✓ |
| GAME-022 | Human always X / computer O | Functional | States never inverted | ✓ (in 001) |
| GAME-023 | Unfinished game not in history | Functional | Mid-game → History empty/unchanged | ✓ HIST-002 |

---

## Automated in `game.spec.ts`

`GAME-001` … `GAME-006`, `GAME-008` … `GAME-021`, plus `DIFF-001`  
(`GAME-007` / `GAME-022` covered inside `GAME-001`; `GAME-023` in `history.spec.ts`)

---

## Related elsewhere

| ID | Spec |
|----|------|
| DIFF-* | difficulty confirm / persistence |
| HIST-002 / 003 | unfinished vs finished recording |
| E2E-001 / 004 | finish → history / difficulty accept |
| I18N-004 | Persian status / controls |
