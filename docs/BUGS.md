# Known bugs & issues

Findings from exploratory testing of `app/index.html` (SUT).  
**Legend:** Severity = High / Medium / Low · Status = Open  

These are product issues (not automation failures).

---

## Summary

| ID | Severity | Title | Area |
|----|----------|-------|------|
| BUG-001 | Medium | Difficulty `<select>` can disagree with stored difficulty after Cancel | Play / Difficulty |
| BUG-002 | Medium | Incomplete Persian translations | i18n |
| BUG-003 | Low | Profile “Created” label not translated in Persian | i18n / Profile |
| BUG-004 | Low | Shell title & subtitle never localize | i18n / Shell |
| BUG-005 | Low | Native `window.confirm` for destructive / mid-game actions | UX |
| BUG-006 | Low | Very long display names allowed (no `maxLength`) | Auth / Profile |
| BUG-007 | Info | User lookup is case-insensitive; storage key is lowercased | Auth / Persistence |

---

## BUG-001 — Difficulty select vs stored value after Cancel

**Severity:** Medium  
**Area:** Play → difficulty  

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

**Severity:** Medium  
**Area:** i18n  

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

**Severity:** Low  
**Area:** Profile / i18n  

### Steps
1. Login, open **Profile**.
2. Switch language to Persian.

### Expected
Label next to the created date is translated (like Win/Loss/Draw → برد/باخت/مساوی).

### Actual
Label remains English **`Created`**, while the date value may render in a localized/Persian-calendar form.

---

## BUG-004 — Shell title & subtitle never localize

**Severity:** Low  
**Area:** Shell / i18n  

`data-testid="title"` / `subtitle` always show:

- `Tic-Tac-Toe`
- `A small game for test automation`

even when `html[lang=fa]`.

May be intentional branding; still a localization gap if Persian is a first-class locale.

---

## BUG-005 — Native `window.confirm` dialogs

**Severity:** Low (UX / a11y)  
**Area:** Difficulty, Delete account, Clear history  

### Observation
Mid-game difficulty change, delete account, and clear history use the browser’s native confirm dialog.

### Impact
- Not styleable; poor fit with in-app theme (light/dark) and RTL.
- Harder for assistive tech / automation than in-page modals with roles.
- Copy is English only in the probed difficulty string:  
  `Change difficulty and start a new game?`

---

## BUG-006 — No maximum length on names

**Severity:** Low  
**Area:** Auth / Profile  

### Observation
- Register name input: no practical `maxLength` enforced in the probed UI.
- Profile name: `minLength=2`, `required=true`, `maxLength` unset (`-1`).

### Impact
Extremely long names can distort header (`hello-user` / avatar area) and storage payload size.

---

## BUG-007 — Case-insensitive identity (design caveat)

**Severity:** Info (likely intentional)  
**Area:** Auth / Persistence  

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
