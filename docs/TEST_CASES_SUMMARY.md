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
| **P0** | Critical path — must stay green for a credible take-home |
| **P1** | Important coverage — automate when cheap / stabilizes product claims |
| **Backlog** | Edge / subjective / expensive — defer unless time allows |

> Detailed per-section catalogs: [`test-cases/`](test-cases/README.md)  
> Known product bugs/issues: [`BUGS.md`](BUGS.md)  
> Automation architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)

---

## Overview

| Metric | Count |
|--------|------:|
| Total cases | **136** |
| Catalog automated (✓) | **123** |
| Dedicated `it('[ID]')` blocks | **85** |
| Partial (◐) | 2 |
| Planned / manual (○) | 11 |
| Priority P0 | **60** |

Catalog ✓ can exceed dedicated `it()` count when one test covers multiple IDs. The Spec map below lists dedicated `it('[ID]')` blocks.

| Area | Cases | ✓ | ◐ | ○ | Spec | Catalog |
|------|------:|--:|--:|--:|------|---------|
| Auth | 17 | 15 | 0 | 2 | `auth.spec.ts` | [AUTH](test-cases/AUTH_TEST_CASES.md) |
| Navigation / shell | 10 | 10 | 0 | 0 | `nav.spec.ts` | [NAV](test-cases/NAV_TEST_CASES.md) |
| Gameplay | 23 | 23 | 0 | 0 | `game.spec.ts` | [GAME](test-cases/GAME_TEST_CASES.md) |
| Difficulty | 9 | 8 | 0 | 1 | `game.spec.ts` / `e2e` | [DIFF](test-cases/DIFFICULTY_TEST_CASES.md) |
| Profile | 13 | 10 | 1 | 2 | `profile.spec.ts` | [PROF](test-cases/PROFILE_TEST_CASES.md) |
| History | 22 | 19 | 1 | 2 | `history.spec.ts` | [HIST](test-cases/HISTORY_TEST_CASES.md) |
| Settings (theme) | 8 | 5 | 0 | 3 | `settings.spec.ts` | [SET](test-cases/SETTINGS_TEST_CASES.md) |
| i18n (language) | 14 | 14 | 0 | 0 | `i18n.spec.ts` | [I18N](test-cases/I18N_TEST_CASES.md) |
| Persistence | 12 | 11 | 0 | 1 | *(cross-spec)* | [STOR](test-cases/PERSISTENCE_TEST_CASES.md) |
| E2E journeys | 8 | 8 | 0 | 0 | `e2e.spec.ts` | [E2E](test-cases/E2E_TEST_CASES.md) |

---

## All test cases

### Auth

Catalog: [`AUTH_TEST_CASES.md`](test-cases/AUTH_TEST_CASES.md) · Spec: `auth.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| AUTH-001 | Register happy path | P0 | ✓ |
| AUTH-002 | Empty name on register | P0 | ✓ |
| AUTH-003 | Name too short | P0 | ✓ |
| AUTH-004 | Duplicate register | P0 | ✓ |
| AUTH-005 | Login mode + unknown + success | P0 | ✓ |
| AUTH-006 | Session on reload; logout clears | P0 | ✓ |
| AUTH-007 | Switch register → login | P1 | ✓ |
| AUTH-008 | Switch login → register | P1 | ✓ |
| AUTH-009 | Auth form on first visit | P0 | ✓ |
| AUTH-010 | Whitespace-only register | P1 | ✓ |
| AUTH-011 | Leading/trailing spaces trimmed | P1 | ✓ |
| AUTH-012 | Case / key normalization | P1 | ✓ |
| AUTH-013 | Very long name | Backlog | ○ |
| AUTH-014 | Special characters in name | Backlog | ○ |
| AUTH-015 | Error clears when switching mode | P1 | ✓ |
| AUTH-016 | Empty login | P1 | ✓ |
| AUTH-017 | Nav hidden when logged out | P0 | ✓ |

### Navigation / shell

Catalog: [`NAV_TEST_CASES.md`](test-cases/NAV_TEST_CASES.md) · Spec: `nav.spec.ts *(+ cross-spec)*`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| NAV-001 | Nav hidden when logged out | P0 | ✓ |
| NAV-002 | Nav Play / Profile / History switch views | P0 | ✓ |
| NAV-003 | Active nav state | P1 | ✓ |
| NAV-004 | Avatar shows first initial | P1 | ✓ |
| NAV-005 | Hello text includes name | P0 | ✓ |
| NAV-006 | Title / subtitle on shell | P1 | ✓ |
| NAV-007 | Theme + language usable on auth | P1 | ✓ |
| NAV-008 | Navigate tabs without losing session | P0 | ✓ |
| NAV-009 | Logout returns to auth | P0 | ✓ |
| NAV-010 | Play → History → Play keeps session | P1 | ✓ |

### Gameplay

Catalog: [`GAME_TEST_CASES.md`](test-cases/GAME_TEST_CASES.md) · Spec: `game.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| GAME-001 | Place X; computer replies O; occupied locked | P0 | ✓ |
| GAME-002 | New Game and Reset clear board | P0 | ✓ |
| GAME-003 | Hint highlights empty cell | P0 | ✓ |
| GAME-004 | Finish updates status, history, profile | P0 | ✓ |
| GAME-005 | Initial board empty | P0 | ✓ |
| GAME-006 | Computer thinking status | P1 | ✓ |
| GAME-007 | Occupied cell not clickable | P1 | ✓ |
| GAME-008 | Cells disabled while busy | P1 | ✓ |
| GAME-009 | Cells disabled after game over | P1 | ✓ |
| GAME-010 | Human win status | P0 | ✓ |
| GAME-011 | Winning cells highlighted | P1 | ✓ |
| GAME-012 | Computer win status | P0 | ✓ |
| GAME-013 | Draw status | P0 | ✓ |
| GAME-014 | Win via row / column / diagonal | P1 | ✓ |
| GAME-015 | New Game after finished | P1 | ✓ |
| GAME-016 | Hint mid-game | P1 | ✓ |
| GAME-017 | Hint disabled when not your turn | P1 | ✓ |
| GAME-018 | Hint fades after timeout | P1 | ✓ |
| GAME-019 | Double-click same empty cell | P1 | ✓ |
| GAME-020 | Status copy matches status attr | P1 | ✓ |
| GAME-021 | Board has 9 cells only | P1 | ✓ |
| GAME-022 | Human always X / computer O | P1 | ✓ |
| GAME-023 | Unfinished game not in history | P1 | ✓ |

### Difficulty

Catalog: [`DIFFICULTY_TEST_CASES.md`](test-cases/DIFFICULTY_TEST_CASES.md) · Spec: `game.spec.ts / e2e`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| DIFF-001 | Change mid-game + Accept | P0 | ✓ |
| DIFF-002 | Default difficulty Easy | P0 | ✓ |
| DIFF-003 | Change Easy→Medium on idle board | P1 | ✓ |
| DIFF-004 | Change mid-game + Dismiss | P0 | ✓ |
| DIFF-005 | Hard AI stronger than Easy | Backlog | ○ |
| DIFF-006 | Difficulty saved on user | P1 | ✓ |
| DIFF-007 | Difficulty shown in history row | P1 | ✓ |
| DIFF-008 | Options Easy/Medium/Hard present | P1 | ✓ |
| DIFF-009 | Accept then finish records new difficulty | P1 | ✓ |

### Profile

Catalog: [`PROFILE_TEST_CASES.md`](test-cases/PROFILE_TEST_CASES.md) · Spec: `profile.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| PROF-001 | Stats + rename success | P0 | ✓ |
| PROF-002 | Reject whitespace-only name | P1 | ✓ |
| PROF-003 | Delete account accept | P0 | ✓ |
| PROF-004 | Created date displayed | P1 | ✓ |
| PROF-005 | Initial stats zero | P0 | ✓ |
| PROF-006 | Rename too short (native) | P1 | ✓ |
| PROF-007 | Rename to existing user | P1 | ✓ |
| PROF-008 | Rename updates avatar | P1 | ✓ |
| PROF-009 | Stats after win | P1 | ◐ |
| PROF-010 | Stats after loss | Backlog | ○ |
| PROF-011 | Stats after draw | Backlog | ○ |
| PROF-012 | Delete account dismiss | P0 | ✓ |
| PROF-013 | Clear history zeros profile stats | P0 | ✓ |

### History

Catalog: [`HISTORY_TEST_CASES.md`](test-cases/HISTORY_TEST_CASES.md) · Spec: `history.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| HIST-001 | Empty state for new user | P0 | ✓ |
| HIST-002 | Unfinished game not listed | P0 | ✓ |
| HIST-003 | Finished game creates a row | P0 | ✓ |
| HIST-004 | Multiple games; newest first | P0 | ✓ |
| HIST-005 | Clear History — accept | P0 | ✓ |
| HIST-006 | Clear History — dismiss | P0 | ✓ |
| HIST-007 | Persian language on History (empty copy) | P1 | ✓ |
| HIST-008 | Result labels Win / Loss / Draw | P1 | ✓ |
| HIST-009 | Difficulty column reflects game | P1 | ✓ |
| HIST-010 | Date column non-empty | P1 | ✓ |
| HIST-011 | Row border color by result | Backlog | ◐ |
| HIST-012 | Only one row per finished game | P1 | ✓ |
| HIST-013 | Navigate Play → History → Play | P1 | ✓ |
| HIST-014 | History survives reload (same session) | P0 | ✓ |
| HIST-015 | History survives logout/login | P0 | ✓ |
| HIST-016 | Two users isolated | P0 | ✓ |
| HIST-017 | Hard/Medium difficulty recorded | P1 | ✓ |
| HIST-018 | Clear confirm message copy | P1 | ✓ |
| HIST-019 | Cap at 100 history entries | Backlog | ○ |
| HIST-020 | Empty state after delete+re-register | P1 | ✓ |
| HIST-021 | English labels after switching back from Persian | P1 | ✓ |
| HIST-022 | Dark theme History still readable | Backlog | ○ |

### Settings (theme)

Catalog: [`SETTINGS_TEST_CASES.md`](test-cases/SETTINGS_TEST_CASES.md) · Spec: `settings.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| SET-001 | Toggle light ↔ dark | P0 | ✓ |
| SET-002 | Theme persists after reload | P0 | ✓ |
| SET-003 | Theme + language persist together | P1 | ✓ |
| SET-004 | Default theme light | P0 | ✓ |
| SET-005 | Theme usable on auth screen | P1 | ✓ |
| SET-006 | Dark theme Play still readable | Backlog | ○ |
| SET-007 | Dark theme Profile still readable | Backlog | ○ |
| SET-008 | Dark theme History still readable | Backlog | ○ |

### i18n (language)

Catalog: [`I18N_TEST_CASES.md`](test-cases/I18N_TEST_CASES.md) · Spec: `i18n.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| I18N-001 | Defaults to English (LTR) | P0 | ✓ |
| I18N-002 | Persian → RTL + translated nav | P0 | ✓ |
| I18N-003 | Persian translates auth | P1 | ✓ |
| I18N-004 | Persian translates game status/controls | P1 | ✓ |
| I18N-005 | Switch back to English (LTR) | P0 | ✓ |
| I18N-006 | Language persists after reload | P0 | ✓ |
| I18N-007 | Change language on auth before register | P1 | ✓ |
| I18N-008 | Persian History labels | P1 | ✓ |
| I18N-009 | English History after switching back from Persian | P1 | ✓ |
| I18N-010 | Persian Profile labels | P1 | ✓ |
| I18N-011 | Theme button label in Persian | P1 | ✓ |
| I18N-012 | Localized full play journey | P0 | ✓ |
| I18N-013 | Persian Profile created date format | P1 | ✓ |
| I18N-014 | Difficulty options in Persian | P1 | ✓ |

### Persistence

Catalog: [`PERSISTENCE_TEST_CASES.md`](test-cases/PERSISTENCE_TEST_CASES.md) · Spec: `*(cross-spec)*`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| STOR-001 | Users key after register | P1 | ✓ |
| STOR-002 | Session key after login/register | P1 | ✓ |
| STOR-003 | Logout removes session | P0 | ✓ |
| STOR-004 | Delete removes user record | P0 | ✓ |
| STOR-005 | Corrupt users JSON recovery | Backlog | ○ |
| STOR-006 | Theme key persisted | P1 | ✓ |
| STOR-007 | Lang key persisted | P1 | ✓ |
| STOR-008 | Two users isolated | P0 | ✓ |
| STOR-009 | Session survives reload | P0 | ✓ |
| STOR-010 | History survives reload (same session) | P0 | ✓ |
| STOR-011 | History survives logout/login | P0 | ✓ |
| STOR-012 | Difficulty saved on user | P1 | ✓ |

### E2E journeys

Catalog: [`E2E_TEST_CASES.md`](test-cases/E2E_TEST_CASES.md) · Spec: `e2e.spec.ts`

| ID | Title | Priority | Automated |
|----|-------|:--------:|:----------:|
| E2E-001 | Register → finish → history + profile updated | P0 | ✓ |
| E2E-002 | Logout → login → same account plays again | P0 | ✓ |
| E2E-003 | Rename then play; history under new name | P0 | ✓ |
| E2E-004 | Accept difficulty change mid-game then finish | P0 | ✓ |
| E2E-005 | Dismiss difficulty confirm + dismiss delete | P0 | ✓ |
| E2E-006 | Delete account then re-register same name | P0 | ✓ |
| E2E-007 | Two users have isolated history | P0 | ✓ |
| E2E-008 | Play flow in Persian (RTL) then back to English | P0 | ✓ |

---

## Spec map (dedicated `it('[ID]')` blocks)

| Spec | Count | IDs |
|------|------:|-----|
| `auth.spec.ts` | 13 | AUTH-001…006, 008, 010–012, 015–016; STOR-001/002 |
| `nav.spec.ts` | 5 | NAV-003, 004, 006, 008, 010 |
| `game.spec.ts` | 26 | GAME-001…006, 008…021; DIFF-001…004, 006, 008 |
| `profile.spec.ts` | 6 | PROF-001…003, 006…008 |
| `history.spec.ts` | 11 | HIST-001…007, 014–015, 017–018 (+ STOR-011) |
| `settings.spec.ts` | 4 | SET-001…003, 005 |
| `i18n.spec.ts` | 12 | I18N-001…007, 009…011, 013–014 (+ HIST-021) |
| `e2e.spec.ts` | 8 | E2E-001…008 |
| **Total** | **85** | |

Catalog ✓ without a dedicated row above are covered inside another `it()` or a cross-spec journey.

---

## How to run

```bash
npm test                 # all specs
npm run test:auth
npm run test:nav
npm run test:game
npm run test:profile
npm run test:history
npm run test:settings
npm run test:i18n
npm run test:e2e

npm run report           # generate Allure HTML + open (needs Java)
npm run report:generate  # generate only → allure-report/
npm run report:open      # open existing allure-report/
```
