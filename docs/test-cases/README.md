# Test case catalogs by section

Per-area inventories in the same format as the original History catalog.

**Legend**

| Mark | Meaning |
|------|---------|
| ✓ | Automated — dedicated `it('[ID]')`, covered inside another test, or asserted cross-spec (see catalog notes like `✓ E2E-005`) |
| ◐ | Partial — some assertions exist; full expected behavior not locked in |
| ○ | Planned / manual — not automated yet |

All-cases summary: [`../TEST_CASES_SUMMARY.md`](../TEST_CASES_SUMMARY.md) · Known bugs: [`../BUGS.md`](../BUGS.md)

| Section | File | Spec | ID prefix |
|---------|------|------|-----------|
| Auth | [AUTH_TEST_CASES.md](AUTH_TEST_CASES.md) | `auth.spec.ts` | `AUTH` |
| Navigation / shell | [NAV_TEST_CASES.md](NAV_TEST_CASES.md) | *(cross-spec)* | `NAV` |
| Gameplay | [GAME_TEST_CASES.md](GAME_TEST_CASES.md) | `game.spec.ts` | `GAME` |
| Difficulty | [DIFFICULTY_TEST_CASES.md](DIFFICULTY_TEST_CASES.md) | `game.spec.ts` / `e2e` | `DIFF` |
| Profile | [PROFILE_TEST_CASES.md](PROFILE_TEST_CASES.md) | `profile.spec.ts` | `PROF` |
| History | [HISTORY_TEST_CASES.md](HISTORY_TEST_CASES.md) | `history.spec.ts` | `HIST` |
| Settings (theme) | [SETTINGS_TEST_CASES.md](SETTINGS_TEST_CASES.md) | `settings.spec.ts` | `SET` |
| i18n (language) | [I18N_TEST_CASES.md](I18N_TEST_CASES.md) | `i18n.spec.ts` | `I18N` |
| Persistence | [PERSISTENCE_TEST_CASES.md](PERSISTENCE_TEST_CASES.md) | *(cross-spec)* | `STOR` |
| E2E journeys | [E2E_TEST_CASES.md](E2E_TEST_CASES.md) | `e2e.spec.ts` | `E2E` |
