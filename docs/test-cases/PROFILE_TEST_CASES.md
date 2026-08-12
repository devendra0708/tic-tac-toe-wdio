# Profile — test cases

**Screen:** Profile nav → `view-profile` (Your Profile)  
**Spec:** `test/specs/profile.spec.ts`  
**IDs:** `[PROF-NNN]`

---

## UI under test (from product)

- Title **Your Profile** (`profile-title`)
- Name input (`input-profile-name`) + **Save** (`btn-save-profile`)
- Message / error (`profile-message`, `profile-error`)
- Stats: wins / losses / draws (`profile-wins` …)
- Created date (`profile-created`)
- **Delete account** (`btn-delete-account`) + native confirm

---

## All possible Profile cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| PROF-001 | Stats + rename success | Functional | W/L/D = 0; created visible; hello updates | ✓ |
| PROF-002 | Reject whitespace-only name | Negative | `profile-error` (enter a name / at least 2) | ✓ |
| PROF-003 | Delete account accept | Functional | Auth screen; login fails for deleted name | ✓ |
| PROF-004 | Created date displayed | Functional | `profile-created` visible | ✓ (in 001) |
| PROF-005 | Initial stats zero | Functional | wins/losses/draws = 0 | ✓ (in 001) |
| PROF-006 | Rename too short (native) | Negative | HTML minlength blocks submit | ○ |
| PROF-007 | Rename to existing user | Negative | profile-error exists | ○ |
| PROF-008 | Rename updates avatar | Functional | Initial changes with new name | ○ |
| PROF-009 | Stats after win | Functional | wins ≥ 1 | ◐ GAME-004 / E2E |
| PROF-010 | Stats after loss | Functional | losses ≥ 1 | ○ |
| PROF-011 | Stats after draw | Functional | draws ≥ 1 | ○ |
| PROF-012 | Delete account dismiss | Negative | Stay on profile; still logged in | ✓ E2E-005 |
| PROF-013 | Clear history zeros profile stats | Functional | After clear, W/L/D → 0 | ✓ HIST-005 |

---

## Automated in `profile.spec.ts`

`PROF-001` … `PROF-003` (core path)

---

## Related elsewhere

| ID | Spec |
|----|------|
| GAME-004 | counters after finish |
| HIST-005 | clear → stats zero |
| E2E-001 / 003 / 005 / 006 | profile in journeys |

## Known bugs

| Bug | Note |
|-----|------|
| [BUG-003](../BUGS.md#bug-003--profile-created-label-not-translated) | “Created” label not translated |
| [BUG-005](../BUGS.md#bug-005--native-windowconfirm-dialogs) | Native confirm for delete account |
| [BUG-006](../BUGS.md#bug-006--no-maximum-length-on-names) | No `maxLength` on profile name |
