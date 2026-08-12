# Known bugs & issues

Findings from exploratory testing of `app/index.html` (SUT).  
These are product issues (not automation failures).

**Legend:** Severity = High / Medium / Low / Info · Status = Open  

---

## Summary

| ID | Severity | Status | Title | Area | Related cases |
|----|----------|--------|-------|------|---------------|
| BUG-001 | Medium | Open | Difficulty `<select>` can disagree with stored difficulty after Cancel | Play / Difficulty | DIFF-004, E2E-005 |
| BUG-002 | Medium | Open | Incomplete Persian translations | i18n | I18N-002 … I18N-004, I18N-010, I18N-011 |
| BUG-003 | Low | Open | Profile “Created” label not translated in Persian | i18n / Profile | I18N-010, PROF-004 |
| BUG-004 | Low | Open | Shell title & subtitle never localize | i18n / Shell | NAV-006, I18N-002 |
| BUG-005 | Low | Open | Native `window.confirm` for destructive / mid-game actions | UX | DIFF-001, HIST-005, PROF-003, E2E-005 |
| BUG-006 | Low | Open | Very long display names allowed (no `maxLength`) | Auth / Profile | AUTH-013 |
| BUG-007 | Info | Open | User lookup is case-insensitive; storage key is lowercased | Auth / Persistence | AUTH-012 |

---

## BUG-001 — Difficulty select vs stored value after Cancel

**Severity:** Medium · **Status:** Open  
**Area:** Play → difficulty  
**Related:** [DIFF-004](test-cases/DIFFICULTY_TEST_CASES.md), [E2E-005](test-cases/E2E_TEST_CASES.md)  

### Steps
1. Register / login and start a game.
2. Place at least one move (board no longer empty).
3. Change **Difficulty** (e.g. Easy → Hard).
4. In the confirm dialog (“Change difficulty and start a new game?”), choose **Cancel**.

### Expected
- Board unchanged.
- Effective / stored difficulty unchanged.
- Difficulty control shows the **previous** value (Easy).

### Actual
- Board and stored user `difficulty` stay on the previous value (e.g. `easy`) — good.
- The `<select data-testid="select-language">` / difficulty control may still display the **cancelled** option (`hard`) after dismiss (observed in exploration).

### Impact
Player can believe Hard is active while the engine / `ttt:users[].difficulty` is still Easy (or the reverse after further actions). Misleading UI.

### Notes
Accept path correctly updates stored difficulty, clears the board, and syncs the select.

---

## BUG-002 — Incomplete Persian translations

**Severity:** Medium · **Status:** Open  
**Area:** i18n  
**Related:** [I18N-002 … I18N-004](test-cases/I18N_TEST_CASES.md), [I18N-010](test-cases/I18N_TEST_CASES.md), [I18N-011](test-cases/I18N_TEST_CASES.md)  

Switching language to Persian correctly sets `lang=fa`, `dir=rtl`, and translates most chrome (nav, auth, many play/profile strings). Several strings remain English:

| UI | Persian behavior |
|----|-------------|
| Language field label (`label-language`) | Stays **`LANGUAGE`** (Difficulty label *does* translate → `سختی`) |
| App title (`title`) | Stays **`Tic-Tac-Toe`** |
| App subtitle (`subtitle`) | Stays **`A small game for test automation`** |
| Profile “Created” label | Stays **`Created`** (see BUG-003) |

### Impact
Inconsistent localization; RTL layout with leftover LTR English labels looks unfinished.

---

## BUG-003 — Profile “Created” label not translated

**Severity:** Low · **Status:** Open  
**Area:** Profile / i18n  
**Related:** [I18N-010](test-cases/I18N_TEST_CASES.md), [PROF-004](test-cases/PROFILE_TEST_CASES.md)  

### Steps
1. Login, open **Profile**.
2. Switch language to Persian.

### Expected
Label next to the created date is translated (like Win/Loss/Draw → برد/باخت/مساوی).

### Actual
Label remains English **`Created`**, while the date value may render in a localized/Persian-calendar form.

---

## BUG-004 — Shell title & subtitle never localize

**Severity:** Low · **Status:** Open  
**Area:** Shell / i18n  
**Related:** [NAV-006](test-cases/NAV_TEST_CASES.md), [I18N-002](test-cases/I18N_TEST_CASES.md)  

`data-testid="title"` / `subtitle` always show:

- `Tic-Tac-Toe`
- `A small game for test automation`

even when `html[lang=fa]`.

May be intentional branding; still a localization gap if Persian is a first-class locale.

---

## BUG-005 — Native `window.confirm` dialogs

**Severity:** Low (UX / a11y) · **Status:** Open  
**Area:** Difficulty, Delete account, Clear history  
**Related:** [DIFF-001](test-cases/DIFFICULTY_TEST_CASES.md), [HIST-005](test-cases/HISTORY_TEST_CASES.md), [PROF-003](test-cases/PROFILE_TEST_CASES.md), [E2E-005](test-cases/E2E_TEST_CASES.md)  

### Observation
Mid-game difficulty change, delete account, and clear history use the browser’s native confirm dialog.

### Impact
- Not styleable; poor fit with in-app theme (light/dark) and RTL.
- Harder for assistive tech / automation than in-page modals with roles.
- Copy is English only in the probed difficulty string:  
  `Change difficulty and start a new game?`

---

## BUG-006 — No maximum length on names

**Severity:** Low · **Status:** Open  
**Area:** Auth / Profile  
**Related:** [AUTH-013](test-cases/AUTH_TEST_CASES.md)  

### Observation
- Register name input: no practical `maxLength` enforced in the probed UI.
- Profile name: `minLength=2`, `required=true`, `maxLength` unset (`-1`).

### Impact
Extremely long names can distort header (`hello-user` / avatar area) and storage payload size.

---

## BUG-007 — Case-insensitive identity (design caveat)

**Severity:** Info (likely intentional) · **Status:** Open  
**Area:** Auth / Persistence  
**Related:** [AUTH-012](test-cases/AUTH_TEST_CASES.md)  

### Observation
- `ttt:users` keys are **lowercased** (e.g. `buguser123`).
- Display `name` / `ttt:session` keep original casing (`BugUser123`).
- Login with different case succeeds; registering the same name in another case is rejected as taken.

### Impact
Not necessarily a defect, but surprising if users expect case-sensitive accounts. Document as product behavior.

---

## Checked — not filed as bugs

| Check | Result |
|-------|--------|
| Whitespace-only register | Correctly errors: `Please enter a name.` |
| Name length &lt; 2 | Correctly errors |
| Trim on register (`  TrimMe  `) | Stored/shown as `TrimMe` |
| Idle difficulty change | No confirm; value updates immediately |
| Difficulty accept mid-game | Board clears; stored difficulty updates |
| Theme / lang persistence keys | `ttt:theme`, `ttt:lang` written as expected |
| New Game / Reset | Both clear board; difficulty preserved |

---

## Suggested follow-ups

1. On difficulty **Cancel**, reset `<select>` to the stored difficulty (fix BUG-001).  
2. Add missing Persian strings for LANGUAGE label, Created, title/subtitle (or document as non-localized).  
3. Replace native confirms with in-app modals (optional UX upgrade).  
4. Add `maxLength` on name fields if long names are undesirable.

---

*Generated from manual + CDP exploratory passes against the local SUT.*
