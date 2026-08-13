# Auth — test cases

**Screen:** Auth form (`auth-form`) — register / login by name  
**Spec:** `test/specs/auth.spec.ts`  
**IDs:** `[AUTH-NNN]`

---

## UI under test (from product)

- Form `data-mode=register|login`
- Name input (`input-name`), min 2 chars
- **Create Account** (`btn-register`) / **Log in** (`btn-login`)
- Mode switch (`btn-switch-mode`)
- Error (`auth-error`)
- On success → Play view + `hello-user` + nav

---

## All possible Auth cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| AUTH-001 | Register happy path | Functional | Play view; hello shows name; nav visible | ✓ |
| AUTH-002 | Empty name on register | Negative | `Please enter a name.` | ✓ |
| AUTH-003 | Name too short | Negative | `Name must be at least 2 characters.` | ✓ |
| AUTH-004 | Duplicate register | Negative | Already-exists error | ✓ |
| AUTH-005 | Login mode + unknown + success | Functional | Mode login; reject Nobody; login existing → Play | ✓ |
| AUTH-006 | Session on reload; logout clears | Persistence | Refresh stays logged in; logout + refresh → register | ✓ |
| AUTH-007 | Switch register → login | Functional | `data-mode=login`; login btn shown | ✓ (in 005) |
| AUTH-008 | Switch login → register | Functional | `data-mode=register`; register btn | ✓ |
| AUTH-009 | Auth form on first visit | Functional | Register mode by default | ✓ (in 001) |
| AUTH-010 | Whitespace-only register | Negative | Empty-name error after trim | ✓ |
| AUTH-011 | Leading/trailing spaces trimmed | Edge | Stored/shown trimmed consistently | ✓ |
| AUTH-012 | Case / key normalization | Edge | Document Alice vs alice lookup | ✓ |
| AUTH-013 | Very long name | Edge | Accepted or graceful UI | ○ |
| AUTH-014 | Special characters in name | Edge | `O'Brien`, `علی`, emoji OK if ≥2 | ○ |
| AUTH-015 | Error clears when switching mode | Functional | Error hidden after switch | ✓ |
| AUTH-016 | Empty login | Negative | Empty-name error in login mode | ✓ |
| AUTH-017 | Nav hidden when logged out | Functional | No Play/Profile/History on auth | ✓ (related NAV) |

---

## Automated in `auth.spec.ts`

`AUTH-001` … `AUTH-006`, `AUTH-008`, `AUTH-010` … `AUTH-012`, `AUTH-015`, `AUTH-016`

---

## Related elsewhere

| ID | Spec |
|----|------|
| E2E-002 | logout → login returning player |
| E2E-006 | delete → cannot login; re-register |
| NAV-* | shell visibility while logged out |

## Known bugs

| Bug | Note |
|-----|------|
| [BUG-006](../BUGS.md#bug-006--no-maximum-length-on-names) | No `maxLength` on names (AUTH-013) |
| [BUG-007](../BUGS.md#bug-007--case-insensitive-identity-design-caveat) | Case-insensitive identity (AUTH-012) |
