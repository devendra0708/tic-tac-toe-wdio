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
| BUG-006 | Low | Open | Very long display names allowed (no `maxLength`); can overflow layout | Auth / Profile | AUTH-013 |
| BUG-007 | Info | Open | User lookup is case-insensitive; storage key is lowercased | Auth / Persistence | AUTH-012 |
| BUG-008 | Low | Open | History list not clamped on read — >100 stored rows all render until next write | History / Persistence | HIST-019 |
| BUG-009 | Info | Open | In-progress board is not restored after reload (session kept) | Game / Persistence | STOR-009 / GAME |

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
| Language field label (`label-language`) | Stays **`Language`** (Difficulty label *does* translate → `سختی`) |
| App title (`title`) | Stays **`Tic-Tac-Toe`** (while `document.title` becomes **`دوز`**) |
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

**Note:** `document.title` *does* localize (English `Tic-Tac-Toe` → Persian `دوز`), so the tab title and on-page hero title disagree in Persian.

May be intentional branding for the in-page hero; still a localization gap / inconsistency if Persian is a first-class locale.

---

## BUG-005 — Native `window.confirm` dialogs

**Severity:** Low (UX / a11y) · **Status:** Open  
**Area:** Difficulty, Delete account, Clear history  
**Related:** [DIFF-001](test-cases/DIFFICULTY_TEST_CASES.md), [HIST-005](test-cases/HISTORY_TEST_CASES.md), [PROF-003](test-cases/PROFILE_TEST_CASES.md), [E2E-005](test-cases/E2E_TEST_CASES.md)  

### Observation
Mid-game difficulty change, delete account, and clear history use the browser’s native confirm dialog.

Copy **is** localized when language is Persian (examples observed):
- Difficulty: `سختی تغییر کند و بازی جدید شروع شود؟`
- Clear history: `همهٔ تاریخچهٔ بازی‌ها پاک شود؟`
- Delete account: `این حساب و همهٔ داده‌های آن حذف شوند؟ این عمل بازگشت‌پذیر نیست.`

### Impact
- Not styleable; poor fit with in-app theme (light/dark) and RTL layout.
- Harder for assistive tech / automation than in-page modals with roles.
- Still a native OS chrome dialog, not an in-app modal.
---

## BUG-006 — No maximum length on names

**Severity:** Low · **Status:** Open  
**Area:** Auth / Profile  
**Related:** [AUTH-013](test-cases/AUTH_TEST_CASES.md)  

### Observation
- Register name input: no practical `maxLength` enforced in the probed UI (`maxLength` = `-1`).
- Profile name: `minLength=2`, `required=true`, `maxLength` unset (`-1`).

### Impact
Extremely long names (e.g. 300+ chars) are accepted and can force **horizontal page overflow** (`documentElement.scrollWidth` ≫ viewport) via `hello-user`, plus large `localStorage` payloads.

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

## BUG-008 — History list not clamped on read

**Severity:** Low · **Status:** Open  
**Area:** History / Persistence  
**Related:** [HIST-019](test-cases/HISTORY_TEST_CASES.md)  

### Steps
1. Register / login.
2. In DevTools, set the current user’s `history` array in `ttt:users` to **105** entries.
3. Refresh and open **History**.
4. Finish one more game, then open **History** again.

### Expected
UI (and storage) never expose more than the documented cap (100).

### Actual
- After inject + refresh: History renders **all 105** rows.
- After finishing another game: storage and UI drop to **100** (write-path cap works).

### Impact
Cap is enforced only when appending history, not when loading/rendering. Manually edited or corrupted storage can show an oversized list until the next finished game.

---

## BUG-009 — In-progress board not restored after reload

**Severity:** Info (likely intentional) · **Status:** Open  
**Area:** Game / Persistence  
**Related:** STOR-009 (session survives), GAME unfinished-board cases  

### Observation
1. Login, place mid-game moves (board has X/O, status `your-turn`).
2. Reload the page.

### Actual
- Session remains (`ttt:session`); user lands back on **Play**.
- Board is empty again (`your-turn`); in-progress cells are not restored.
- Finished games in History / profile stats are unaffected (those are persisted).

### Impact
Not necessarily a defect — many SPAs treat the live board as ephemeral. Worth documenting so testers don’t file false “data loss” bugs. Contrast with theme/lang/session which *do* survive reload.

---

## Checked — not filed as bugs

| Check | Result |
|-------|--------|
| Whitespace-only register | Correctly errors: `Please enter a name.` |
| Name length &lt; 2 | Correctly errors |
| Trim on register (`  TrimMe  `) | Stored/shown as `TrimMe` |
| HTML-ish display name | Escaped in hello (no script execution) |
| Rename to existing user | Rejected: `Another account already uses this name.` |
| Idle difficulty change | No confirm; value updates immediately |
| Difficulty accept mid-game | Board clears; stored difficulty updates |
| Difficulty / clear / delete confirms in Persian | Localized (not English-only) |
| History write cap (100) | Enforced when appending a new finished game |
| Corrupt `ttt:users` JSON | App still boots to auth; next register rewrites users |
| Theme / lang persistence keys | `ttt:theme`, `ttt:lang` written as expected |
| New Game / Reset | Both clear board + hint/win highlight; keep difficulty; do **not** change history or profile stats. Only UI differs (primary vs danger styling / labels). |
| Enter on register | Submits successfully |
| Play → History → Play mid-game | Board preserved while navigating |

---

## Suggested follow-ups

1. On difficulty **Cancel**, reset `<select>` to the stored difficulty (fix BUG-001).  
2. Add missing Persian strings for Language label, Created, on-page title/subtitle (or document as non-localized).  
3. Replace native confirms with in-app modals (optional UX upgrade).  
4. Add `maxLength` on name fields if long names / overflow are undesirable (BUG-006).  
5. Clamp history to 100 on read/render as well as write (BUG-008).  
6. Optionally persist in-progress board if resume-after-reload is desired (BUG-009).

---

*Updated from a full exploratory pass (auth, profile, game, history, i18n, persistence) against the local SUT.*
