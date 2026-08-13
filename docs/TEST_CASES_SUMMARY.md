# Tic-Tac-Toe — Test Cases Summary

**SUT:** `app/index.html` (SPA, `localStorage`-backed)  
**Stack:** WebdriverIO + TypeScript + Chrome  
**Run:** `npm install && npm test`  
**Legend**

| Mark | Meaning |
|------|---------|
| ✓ | Automated — dedicated `it('[ID]')`, covered inside another test, or asserted cross-spec |
| ◐ | Partial — some assertions exist; full expected behavior not locked in |
| ○ | Planned / manual — not automated yet |

> Detailed per-section catalogs: [`test-cases/`](test-cases/README.md)  
> Known product bugs/issues: [`BUGS.md`](BUGS.md)

---

## Overview

| Metric | Count |
|--------|------:|
| Total cases | **136** |
| Catalog automated (✓) | **96** |
| Dedicated `it('[ID]')` blocks | **65** |
| Partial (◐) | 3 |
| Planned / manual (○) | 37 |

Catalog ✓ can exceed dedicated `it()` count when one test covers multiple IDs. The Spec map below lists only dedicated `it('[ID]')` blocks.

| Area | Cases | ✓ | ◐ | ○ | Spec | Catalog |
|------|------:|--:|--:|--:|------|---------|
| Auth | 17 | 11 | 0 | 6 | `auth.spec.ts` | [AUTH](test-cases/AUTH_TEST_CASES.md) |
| Navigation / shell | 10 | 4 | 1 | 5 | *(cross-spec)* | [NAV](test-cases/NAV_TEST_CASES.md) |
| Gameplay | 23 | 23 | 0 | 0 | `game.spec.ts` | [GAME](test-cases/GAME_TEST_CASES.md) |
| Difficulty | 9 | 7 | 0 | 2 | `game.spec.ts` / `e2e` | [DIFF](test-cases/DIFFICULTY_TEST_CASES.md) |
| Profile | 13 | 8 | 1 | 4 | `profile.spec.ts` | [PROF](test-cases/PROFILE_TEST_CASES.md) |
| History | 22 | 14 | 1 | 7 | `history.spec.ts` | [HIST](test-cases/HISTORY_TEST_CASES.md) |
| Settings (theme) | 8 | 4 | 0 | 4 | `settings.spec.ts` | [SET](test-cases/SETTINGS_TEST_CASES.md) |
| i18n (language) | 14 | 11 | 0 | 3 | `i18n.spec.ts` | [I18N](test-cases/I18N_TEST_CASES.md) |
| Persistence | 12 | 8 | 0 | 4 | *(cross-spec)* | [STOR](test-cases/PERSISTENCE_TEST_CASES.md) |
| E2E journeys | 8 | 8 | 0 | 0 | `e2e.spec.ts` | [E2E](test-cases/E2E_TEST_CASES.md) |

---

## All test cases

### Auth

Catalog: [`AUTH_TEST_CASES.md`](test-cases/AUTH_TEST_CASES.md) · Spec: `auth.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| AUTH-001 | Register happy path | ✓ |
| AUTH-002 | Empty name on register | ✓ |
| AUTH-003 | Name too short | ✓ |
| AUTH-004 | Duplicate register | ✓ |
| AUTH-005 | Login mode + unknown + success | ✓ |
| AUTH-006 | Session on reload; logout clears | ✓ |
| AUTH-007 | Switch register → login | ✓ |
| AUTH-008 | Switch login → register | ○ |
| AUTH-009 | Auth form on first visit | ✓ |
| AUTH-010 | Whitespace-only register | ✓ |
| AUTH-011 | Leading/trailing spaces trimmed | ✓ |
| AUTH-012 | Case / key normalization | ○ |
| AUTH-013 | Very long name | ○ |
| AUTH-014 | Special characters in name | ○ |
| AUTH-015 | Error clears when switching mode | ○ |
| AUTH-016 | Empty login | ○ |
| AUTH-017 | Nav hidden when logged out | ✓ |

### Navigation / shell

Catalog: [`NAV_TEST_CASES.md`](test-cases/NAV_TEST_CASES.md) · Spec: *(cross-spec)*

| ID | Title | Automated |
|----|-------|:----------:|
| NAV-001 | Nav hidden when logged out | ✓ |
| NAV-002 | Nav Play / Profile / History switch views | ◐ |
| NAV-003 | Active nav state | ○ |
| NAV-004 | Avatar shows first initial | ○ |
| NAV-005 | Hello text includes name | ✓ |
| NAV-006 | Title / subtitle on shell | ○ |
| NAV-007 | Theme + language usable on auth | ✓ |
| NAV-008 | Navigate tabs without losing session | ○ |
| NAV-009 | Logout returns to auth | ✓ |
| NAV-010 | Play → History → Play keeps board context | ○ |

### Gameplay

Catalog: [`GAME_TEST_CASES.md`](test-cases/GAME_TEST_CASES.md) · Spec: `game.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| GAME-001 | Place X; computer replies O; occupied locked | ✓ |
| GAME-002 | New Game and Reset clear board | ✓ |
| GAME-003 | Hint highlights empty cell | ✓ |
| GAME-004 | Finish updates status, history, profile | ✓ |
| GAME-005 | Initial board empty | ✓ |
| GAME-006 | Computer thinking status | ✓ |
| GAME-007 | Occupied cell not clickable | ✓ |
| GAME-008 | Cells disabled while busy | ✓ |
| GAME-009 | Cells disabled after game over | ✓ |
| GAME-010 | Human win status | ✓ |
| GAME-011 | Winning cells highlighted | ✓ |
| GAME-012 | Computer win status | ✓ |
| GAME-013 | Draw status | ✓ |
| GAME-014 | Win via row / column / diagonal | ✓ |
| GAME-015 | New Game after finished | ✓ |
| GAME-016 | Hint mid-game | ✓ |
| GAME-017 | Hint disabled when not your turn | ✓ |
| GAME-018 | Hint fades after timeout | ✓ |
| GAME-019 | Double-click same empty cell | ✓ |
| GAME-020 | Status copy matches status attr | ✓ |
| GAME-021 | Board has 9 cells only | ✓ |
| GAME-022 | Human always X / computer O | ✓ |
| GAME-023 | Unfinished game not in history | ✓ |

### Difficulty

Catalog: [`DIFFICULTY_TEST_CASES.md`](test-cases/DIFFICULTY_TEST_CASES.md) · Spec: `game.spec.ts` / `e2e`

| ID | Title | Automated |
|----|-------|:----------:|
| DIFF-001 | Change mid-game + Accept | ✓ |
| DIFF-002 | Default difficulty Easy | ✓ |
| DIFF-003 | Change Easy→Medium on idle board | ✓ |
| DIFF-004 | Change mid-game + Dismiss | ✓ |
| DIFF-005 | Hard AI stronger than Easy | ○ |
| DIFF-006 | Difficulty saved on user | ✓ |
| DIFF-007 | Difficulty shown in history row | ✓ |
| DIFF-008 | Options Easy/Medium/Hard present | ○ |
| DIFF-009 | Accept then finish records new difficulty | ✓ |

### Profile

Catalog: [`PROFILE_TEST_CASES.md`](test-cases/PROFILE_TEST_CASES.md) · Spec: `profile.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| PROF-001 | Stats + rename success | ✓ |
| PROF-002 | Reject whitespace-only name | ✓ |
| PROF-003 | Delete account accept | ✓ |
| PROF-004 | Created date displayed | ✓ |
| PROF-005 | Initial stats zero | ✓ |
| PROF-006 | Rename too short (native) | ○ |
| PROF-007 | Rename to existing user | ✓ |
| PROF-008 | Rename updates avatar | ○ |
| PROF-009 | Stats after win | ◐ |
| PROF-010 | Stats after loss | ○ |
| PROF-011 | Stats after draw | ○ |
| PROF-012 | Delete account dismiss | ✓ |
| PROF-013 | Clear history zeros profile stats | ✓ |

### History

Catalog: [`HISTORY_TEST_CASES.md`](test-cases/HISTORY_TEST_CASES.md) · Spec: `history.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| HIST-001 | Empty state for new user | ✓ |
| HIST-002 | Unfinished game not listed | ✓ |
| HIST-003 | Finished game creates a row | ✓ |
| HIST-004 | Multiple games; newest first | ✓ |
| HIST-005 | Clear History — accept | ✓ |
| HIST-006 | Clear History — dismiss | ✓ |
| HIST-007 | Persian language on History (empty copy) | ✓ |
| HIST-008 | Result labels Win / Loss / Draw | ✓ |
| HIST-009 | Difficulty column reflects game | ✓ |
| HIST-010 | Date column non-empty | ✓ |
| HIST-011 | Row border color by result | ◐ |
| HIST-012 | Only one row per finished game | ✓ |
| HIST-013 | Navigate Play → History → Play | ○ |
| HIST-014 | History survives reload (same session) | ✓ |
| HIST-015 | History survives logout/login | ○ |
| HIST-016 | Two users isolated | ✓ |
| HIST-017 | Hard/Medium difficulty recorded | ○ |
| HIST-018 | Clear confirm message copy | ○ |
| HIST-019 | Cap at 100 history entries | ○ |
| HIST-020 | Empty state after delete+re-register | ✓ |
| HIST-021 | English labels after switching back from Persian | ○ |
| HIST-022 | Dark theme History still readable | ○ |

### Settings (theme)

Catalog: [`SETTINGS_TEST_CASES.md`](test-cases/SETTINGS_TEST_CASES.md) · Spec: `settings.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| SET-001 | Toggle light ↔ dark | ✓ |
| SET-002 | Theme persists after reload | ✓ |
| SET-003 | Theme + language persist together | ✓ |
| SET-004 | Default theme light | ✓ |
| SET-005 | Theme usable on auth screen | ○ |
| SET-006 | Dark theme Play still readable | ○ |
| SET-007 | Dark theme Profile still readable | ○ |
| SET-008 | Dark theme History still readable | ○ |

### i18n (language)

Catalog: [`I18N_TEST_CASES.md`](test-cases/I18N_TEST_CASES.md) · Spec: `i18n.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| I18N-001 | Defaults to English (LTR) | ✓ |
| I18N-002 | Persian → RTL + translated nav | ✓ |
| I18N-003 | Persian translates auth | ✓ |
| I18N-004 | Persian translates game status/controls | ✓ |
| I18N-005 | Switch back to English (LTR) | ✓ |
| I18N-006 | Language persists after reload | ✓ |
| I18N-007 | Change language on auth before register | ✓ |
| I18N-008 | Persian History labels | ✓ |
| I18N-009 | English History after switching back from Persian | ○ |
| I18N-010 | Persian Profile labels | ○ |
| I18N-011 | Theme button label in Persian | ○ |
| I18N-012 | Localized full play journey | ✓ |
| I18N-013 | Persian Profile created date format | ✓ |
| I18N-014 | Difficulty options in Persian | ✓ |

### Persistence

Catalog: [`PERSISTENCE_TEST_CASES.md`](test-cases/PERSISTENCE_TEST_CASES.md) · Spec: *(cross-spec)*

| ID | Title | Automated |
|----|-------|:----------:|
| STOR-001 | Users key after register | ○ |
| STOR-002 | Session key after login/register | ○ |
| STOR-003 | Logout removes session | ✓ |
| STOR-004 | Delete removes user record | ✓ |
| STOR-005 | Corrupt users JSON recovery | ○ |
| STOR-006 | Theme key persisted | ✓ |
| STOR-007 | Lang key persisted | ✓ |
| STOR-008 | Two users isolated | ✓ |
| STOR-009 | Session survives reload | ✓ |
| STOR-010 | History survives reload (same session) | ✓ |
| STOR-011 | History survives logout/login | ○ |
| STOR-012 | Difficulty saved on user | ✓ |

### E2E journeys

Catalog: [`E2E_TEST_CASES.md`](test-cases/E2E_TEST_CASES.md) · Spec: `e2e.spec.ts`

| ID | Title | Automated |
|----|-------|:----------:|
| E2E-001 | Register → finish → history + profile updated | ✓ |
| E2E-002 | Logout → login → same account plays again | ✓ |
| E2E-003 | Rename then play; history under new name | ✓ |
| E2E-004 | Accept difficulty change mid-game then finish | ✓ |
| E2E-005 | Dismiss difficulty confirm + dismiss delete | ✓ |
| E2E-006 | Delete account then re-register same name | ✓ |
| E2E-007 | Two users have isolated history | ✓ |
| E2E-008 | Play flow in Persian (RTL) then back to English | ✓ |

---

## Spec map (dedicated `it('[ID]')` blocks)

| Spec | IDs | Count |
|------|-----|------:|
| `auth.spec.ts` | AUTH-001 … AUTH-006, AUTH-010, AUTH-011 | 8 |
| `game.spec.ts` | GAME-001 … GAME-006, GAME-008 … GAME-021, DIFF-001 … DIFF-004, DIFF-006 | 25 |
| `profile.spec.ts` | PROF-001 … PROF-003, PROF-007 | 4 |
| `history.spec.ts` | HIST-001 … HIST-007, HIST-014 | 8 |
| `settings.spec.ts` | SET-001 … SET-003 | 3 |
| `i18n.spec.ts` | I18N-001 … I18N-007, I18N-013, I18N-014 | 9 |
| `e2e.spec.ts` | E2E-001 … E2E-008 | 8 |
| **Total** | | **65** |

Catalog ✓ without a row above (e.g. AUTH-007, GAME-007, HIST-008, STOR-*, NAV-*) are covered inside another `it()` or a cross-spec journey — not missing from the suite unless marked ○.

---

## How to run

```bash
npm test                 # all specs
npm run test:auth
npm run test:game
npm run test:profile
npm run test:history
npm run test:settings
npm run test:i18n
npm run test:e2e
```
