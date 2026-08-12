# Difficulty — test cases

**Screen:** Play view — difficulty select (`select-difficulty`)  
**Spec:** `test/specs/game.spec.ts` (`[DIFF-001]`); also `e2e.spec.ts`  
**IDs:** `[DIFF-NNN]`

---

## UI under test (from product)

- Select options: **Easy** / **Medium** / **Hard** (`easy` · `medium` · `hard`)
- Changing mid-game → native confirm (board reset if accepted)
- Dismiss keeps board + previous difficulty
- Finished games record difficulty in History column

---

## All possible Difficulty cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| DIFF-001 | Change mid-game + Accept | Functional | Confirm → empty board + new difficulty | ✓ |
| DIFF-002 | Default difficulty Easy | Functional | Select value `easy` for new user | ○ |
| DIFF-003 | Change Easy→Medium on idle board | Functional | Updates without confirm | ○ |
| DIFF-004 | Change mid-game + Dismiss | Negative | Board & difficulty unchanged | ✓ E2E-005 |
| DIFF-005 | Hard AI stronger than Easy | Edge | Perfect play rarely loses on Hard | ○ manual |
| DIFF-006 | Difficulty saved on user | Persistence | Set Hard → logout/login → still Hard | ○ |
| DIFF-007 | Difficulty shown in history row | Functional | Row difficulty matches game | ✓ HIST-003 |
| DIFF-008 | Options Easy/Medium/Hard present | Functional | Three options in select | ○ |
| DIFF-009 | Accept then finish records new difficulty | Functional | History shows Hard/Easy after change | ✓ E2E-004 |

---

## Automated in specs

| ID | Where |
|----|-------|
| DIFF-001 | `game.spec.ts` |
| DIFF-004 / 009 | `e2e.spec.ts` (E2E-005 / E2E-004) |

---

## Related elsewhere

| ID | Spec |
|----|------|
| GAME-004 | finish on Easy |
| HIST-003 / 017 | difficulty column |
| E2E-004 / 005 | accept / dismiss flows |

## Known bugs

| Bug | Note |
|-----|------|
| [BUG-001](../BUGS.md#bug-001--difficulty-select-vs-stored-value-after-cancel) | Select may show cancelled difficulty after Dismiss (DIFF-004 / E2E-005) |
| [BUG-005](../BUGS.md#bug-005--native-windowconfirm-dialogs) | Native confirm for mid-game difficulty change |
