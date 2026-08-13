# History tab — test cases

**Screen:** History nav → `view-history` (Game History table or empty state)  
**Spec:** `test/specs/history.spec.ts`  
**IDs:** `[HIST-NNN]`

---

## UI under test (from product)

- Nav **History** tab (`nav-history`, `data-active`)
- Title **Game History**
- Empty: “No games yet. Play one!” (`history-empty`) — no Clear button
- Table columns: **DATE** | **DIFFICULTY** | **RESULT**
- Rows: `history-row-N` with `data-result=win|loss|draw` (green / red / gray bar)
- Cells: `history-date-N`, `history-difficulty-N`, `history-result-N`
- **Clear History** (`btn-clear-history`) + native confirm

---

## All possible History cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------------|
| HIST-001 | Empty state for new user | Functional | Empty copy; no table; no Clear; History tab active | ✓ |
| HIST-002 | Unfinished game not listed | Functional | After mid-game move, history still empty | ✓ |
| HIST-003 | Finished game creates a row | Functional | Date, Easy, Win/Loss/Draw; `data-result`; Clear visible | ✓ |
| HIST-004 | Multiple games; newest first | Functional | ≥2 rows; row-0 = latest result | ✓ |
| HIST-005 | Clear History — accept | Functional | Empty again; Clear gone; profile W/L/D → 0 | ✓ |
| HIST-006 | Clear History — dismiss | Negative | Rows unchanged | ✓ |
| HIST-007 | Persian language on History | Functional | RTL; title not “Game History”; empty = هنوز بازی‌ای انجام نشده است. | ✓ |
| HIST-008 | Result labels Win / Loss / Draw | Functional | Text matches `data-result` | ✓ (in 003) |
| HIST-009 | Difficulty column reflects game | Functional | Easy (or Medium/Hard if set) | ✓ (in 003) |
| HIST-010 | Date column non-empty | Functional | Localized date/time string | ✓ (in 003) |
| HIST-011 | Row border color by result | UI | `data-result` win/loss/draw drives CSS | ◐ attr only |
| HIST-012 | Only one row per finished game | Edge | Single finish → exactly 1 row | ✓ (in 003) |
| HIST-013 | Navigate Play → History → Play | Functional | Views switch; data persists | ✓ |
| HIST-014 | History survives reload (same session) | Persistence | Rows still present after refresh | ✓ |
| HIST-015 | History survives logout/login | Persistence | Same user sees prior rows | ✓ |
| HIST-016 | Two users isolated | Persistence | Covered by `[E2E-007]` | ✓ E2E |
| HIST-017 | Hard/Medium difficulty recorded | Functional | Difficulty cell shows Hard/Medium | ○ |
| HIST-018 | Clear confirm message copy | Functional | Confirm mentions history/games | ✓ |
| HIST-019 | Cap at 100 history entries | Edge | 101st drops oldest | ○ manual |
| HIST-020 | Empty state after delete+re-register | Functional | Covered by `[E2E-006]` | ✓ E2E |
| HIST-021 | English labels after switching back from Persian | Functional | Title “Game History” again | ○ |
| HIST-022 | Dark theme History still readable | UI | Table/empty visible in dark | ○ |


---



## Automated in `history.spec.ts`

`HIST-001` … `HIST-007`, `HIST-014`

## Related elsewhere


| ID       | Spec                            |
| -------- | ------------------------------- |
| GAME-004 | finish → history row (smoke)    |
| E2E-001  | history + clear + profile stats |
| E2E-007  | two-user isolation              |

## Known bugs

| Bug | Note |
|-----|------|
| [BUG-005](../BUGS.md#bug-005--native-windowconfirm-dialogs) | Native confirm for Clear History |
