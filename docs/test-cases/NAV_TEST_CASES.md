# Navigation & shell — test cases

**Screen:** App header / chrome (`app-header`) while logged in or on auth  
**Spec:** `test/specs/nav.spec.ts` (+ auth / i18n / e2e for related IDs)  
**IDs:** `[NAV-NNN]`

---

## UI under test (from product)

- Branding: title / subtitle
- Theme toggle (`btn-theme`), language select (`select-language`)
- When logged in: avatar, `hello-user`, nav **Play** / **Profile** / **History**, **Logout**
- Active tab: `data-active` on current nav item
- Views: `view-play` · `view-profile` · `view-history`

---

## All possible Navigation / shell cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| NAV-001 | Nav hidden when logged out | Functional | No nav tabs on auth screen | ✓ (AUTH) |
| NAV-002 | Nav Play / Profile / History switch views | Functional | Correct `view-*` shown | ✓ NAV-003 |
| NAV-003 | Active nav state | Functional | `data-active=true` on current tab | ✓ |
| NAV-004 | Avatar shows first initial | Functional | Name `Sam` → avatar `S` | ✓ |
| NAV-005 | Hello text includes name | Functional | `Hello, {name}` (English) | ✓ (AUTH-001) |
| NAV-006 | Title / subtitle on shell | Functional | Tic-Tac-Toe branding visible | ✓ |
| NAV-007 | Theme + language usable on auth | Functional | Controls work before login | ✓ (I18N-007) |
| NAV-008 | Navigate tabs without losing session | Functional | Stay logged in across Play ↔ Profile ↔ History | ✓ |
| NAV-009 | Logout returns to auth | Functional | Auth form; session cleared | ✓ (AUTH-006) |
| NAV-010 | Play → History → Play keeps session | Functional | Views switch; account intact | ✓ |

---

## Automated in `nav.spec.ts`

`NAV-003`, `NAV-004`, `NAV-006`, `NAV-008`, `NAV-010`

---

## Related elsewhere

| ID | Spec |
|----|------|
| NAV-001 / NAV-005 / NAV-009 | `auth.spec.ts` |
| NAV-007 | `i18n.spec.ts` / `settings.spec.ts` |
