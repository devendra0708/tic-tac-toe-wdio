# Persistence / storage — test cases

**Layer:** `localStorage` (`ttt:users`, `ttt:session`, theme, lang)  
**Spec:** *(spread across auth / settings / i18n / e2e / profile)*  
**IDs:** `[STOR-NNN]`

---

## Storage under test (from product)

- `ttt:users` — registered accounts + stats / history / difficulty
- `ttt:session` — current logged-in user
- Theme / language keys (or equivalent) for UI prefs
- Isolation: each user’s history and stats are separate

---

## All possible Persistence cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| STOR-001 | Users key after register | Persistence | `ttt:users` exists | ○ |
| STOR-002 | Session key after login/register | Persistence | `ttt:session` set | ○ |
| STOR-003 | Logout removes session | Persistence | Session cleared; auth shown | ✓ AUTH-006 |
| STOR-004 | Delete removes user record | Persistence | Cannot login; user gone | ✓ PROF-003 |
| STOR-005 | Corrupt users JSON recovery | Edge | App recovers to empty users | ○ |
| STOR-006 | Theme key persisted | Persistence | Theme survives reload | ✓ SET-002 |
| STOR-007 | Lang key persisted | Persistence | Lang survives reload | ✓ I18N-006 |
| STOR-008 | Two users isolated | Persistence | A’s history ≠ B’s | ✓ E2E-007 |
| STOR-009 | Session survives reload | Persistence | Still on Play after refresh | ✓ AUTH-006 |
| STOR-010 | History survives reload (same session) | Persistence | Rows present after refresh | ✓ HIST-014 |
| STOR-011 | History survives logout/login | Persistence | Same user sees prior rows | ○ HIST-015 |
| STOR-012 | Difficulty saved on user | Persistence | Hard survives logout/login | ✓ DIFF-006 |

---

## Automated today

No dedicated `storage.spec.ts` — covered via AUTH / SET / I18N / PROF / E2E.

---

## Related elsewhere

| ID | Spec |
|----|------|
| AUTH-006 | session reload / logout |
| SET-002 / 003 | theme (+ lang) |
| I18N-006 | language |
| PROF-003 / E2E-006 | delete lifecycle |
| E2E-007 | two-user isolation |
| HIST-014 / 015 | history persistence backlog |
