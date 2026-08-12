# i18n (language) — test cases

**Screen:** Language select (`select-language`) — EN / FA (RTL)  
**Spec:** `test/specs/i18n.spec.ts`  
**IDs:** `[I18N-NNN]`

---

## UI under test (from product)

- `html[lang=en|fa]` + `dir=ltr|rtl`
- Options: English / Persian
- FA samples: Play → **بازی**, Profile → **پروفایل**, status → **نوبت شما (X)**, auth register → **ساخت حساب**
- Language persists across reload; available on auth screen

---

## All possible i18n cases

| ID | Title | Type | Expected | Auto |
|----|-------|------|----------|------|
| I18N-001 | Defaults to English (LTR) | Functional | `lang=en` `dir=ltr`; Create Account | ✓ |
| I18N-002 | FA → RTL + translated nav | Functional | fa/rtl; بازی / پروفایل / تاریخچه / خروج | ✓ |
| I18N-003 | FA translates auth | Functional | ساخت حساب; empty-name Persian error | ✓ |
| I18N-004 | FA translates game status/controls | Functional | نوبت شما (X); بازی جدید / راهنمایی / بازنشانی | ✓ |
| I18N-005 | Switch back to English (LTR) | Functional | en/ltr; Play; Your turn (X) | ✓ |
| I18N-006 | Language persists after reload | Persistence | fa/rtl + بازی after refresh | ✓ |
| I18N-007 | Change language on auth before register | Functional | Persian auth → register → FA Play + سلام | ✓ |
| I18N-008 | FA History labels | Functional | Title not “Game History”; RTL | ✓ HIST-007 |
| I18N-009 | EN History after switching back from FA | Functional | Title “Game History” again | ○ |
| I18N-010 | FA Profile labels | Functional | Profile strings Persian | ○ |
| I18N-011 | Theme button label in FA | Functional | تیره / روشن as appropriate | ○ |
| I18N-012 | Localized full play journey | E2E | Covered by `[E2E-008]` | ✓ E2E |

---

## Automated in `i18n.spec.ts`

`I18N-001` … `I18N-007`

---

## Related elsewhere

| ID | Spec |
|----|------|
| SET-003 | theme + lang persist together |
| HIST-007 / 021 | History FA / EN |
| E2E-008 | localized play journey |
