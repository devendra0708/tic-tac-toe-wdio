# E2E journeys — test cases

**Scope:** Cross-feature user flows spanning multiple areas  
**Spec:** `test/specs/e2e.spec.ts`  
**IDs:** `[E2E-NNN]`

---

## UI under test (from product)

Full SPA: Auth → Play → Profile → History → Settings/i18n, with `localStorage` session.

---

## All possible E2E cases

| ID | Title | Type | Covers | Auto |
|----|-------|------|--------|------|
| E2E-001 | Register → finish → history + profile updated | E2E | Auth, Game, History, Profile | ✓ |
| E2E-002 | Logout → login → same account plays again | E2E | Auth, Game | ✓ |
| E2E-003 | Rename then play; history under new name | E2E | Auth, Profile, Game, History | ✓ |
| E2E-004 | Accept difficulty change mid-game then finish | E2E | Diff, Game, History | ✓ |
| E2E-005 | Dismiss difficulty confirm + dismiss delete | E2E | Diff, Profile | ✓ |
| E2E-006 | Delete account then re-register same name | E2E | Auth, Profile, Game | ✓ |
| E2E-007 | Two users have isolated history | E2E | Auth, History, Persistence | ✓ |
| E2E-008 | Play flow in Persian (RTL) then back to EN | E2E | i18n, Auth, Game | ✓ |

---

## Automated in `e2e.spec.ts`

`E2E-001` … `E2E-008`

---

## Related elsewhere

| Area catalog | Notes |
|--------------|-------|
| [AUTH](AUTH_TEST_CASES.md) | register / login building blocks |
| [GAME](GAME_TEST_CASES.md) / [DIFFICULTY](DIFFICULTY_TEST_CASES.md) | board + difficulty |
| [PROFILE](PROFILE_TEST_CASES.md) / [HISTORY](HISTORY_TEST_CASES.md) | post-game state |
| [I18N](I18N_TEST_CASES.md) | FA/EN journey detail |
| [PERSISTENCE](PERSISTENCE_TEST_CASES.md) | isolation / session |
