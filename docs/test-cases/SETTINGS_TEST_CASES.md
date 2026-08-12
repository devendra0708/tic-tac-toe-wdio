# Settings (theme) — test cases

**Screen:** Header theme control (`btn-theme`) — light / dark  
**Spec:** `test/specs/settings.spec.ts`  
**IDs:** `[SET-NNN]`

---

## UI under test (from product)

- `html[data-theme=light|dark]`
- Theme button label: **Dark** (when light) / **Light** (when dark); Persian: **تیره** / …
- Theme persists in localStorage across reload
- Language cases live in [`I18N_TEST_CASES.md`](I18N_TEST_CASES.md)

---

## All possible Settings (theme) cases

| ID | Title | Type | Expected | Auto |
|----|-------|------|----------|------|
| SET-001 | Toggle light ↔ dark | Functional | `data-theme` + button label flip both ways | ✓ |
| SET-002 | Theme persists after reload | Persistence | Dark survives refresh | ✓ |
| SET-003 | Theme + language persist together | Persistence | Dark + Persian / RTL after refresh | ✓ |
| SET-004 | Default theme light | Functional | `data-theme=light`; btn Dark | ✓ (in 001) |
| SET-005 | Theme usable on auth screen | Functional | Toggle before register | ○ |
| SET-006 | Dark theme Play still readable | UI | Board/status visible in dark | ○ |
| SET-007 | Dark theme Profile still readable | UI | Stats/form visible in dark | ○ |
| SET-008 | Dark theme History still readable | UI | Table/empty visible in dark | ○ HIST-022 |

---

## Automated in `settings.spec.ts`

`SET-001` … `SET-003`

---

## Related elsewhere

| ID | Spec |
|----|------|
| I18N-* | language / RTL |
| HIST-022 | dark History |
| H06 | theme key in storage |
