# i18n (language) — test cases

**Screen:** Language select (`select-language`) — English / Persian (RTL)  
**Spec:** `test/specs/i18n.spec.ts`  
**IDs:** `[I18N-NNN]`

---

## UI under test (from product)

- `html[lang=en|fa]` + `dir=ltr|rtl`
- Options: English / Persian
- Persian samples: Play → **بازی**, Profile → **پروفایل**, status → **نوبت شما (X)**, auth register → **ساخت حساب**
- Language persists across reload; available on auth screen

---

## All possible i18n cases

| ID | Title | Type | Expected | Automated |
|----|-------|------|----------|------|
| I18N-001 | Defaults to English (LTR) | Functional | `lang=en` `dir=ltr`; Create Account | ✓ |
| I18N-002 | Persian → RTL + translated nav | Functional | `lang=fa` / RTL; بازی / پروفایل / تاریخچه / خروج | ✓ |
| I18N-003 | Persian translates auth | Functional | ساخت حساب; empty-name Persian error | ✓ |
| I18N-004 | Persian translates game status/controls | Functional | نوبت شما (X); بازی جدید / راهنمایی / بازنشانی | ✓ |
| I18N-005 | Switch back to English (LTR) | Functional | en/ltr; Play; Your turn (X) | ✓ |
| I18N-006 | Language persists after reload | Persistence | Persian / RTL + بازی after refresh | ✓ |
| I18N-007 | Change language on auth before register | Functional | Persian auth → register → Persian Play + سلام | ✓ |
| I18N-008 | Persian History labels | Functional | Title not “Game History”; empty هنوز بازی‌ای انجام نشده است.; RTL | ✓ HIST-007 |
| I18N-009 | English History after switching back from Persian | Functional | Title “Game History” again | ○ |
| I18N-010 | Persian Profile labels | Functional | Profile strings in Persian | ○ |
| I18N-011 | Theme button label in Persian | Functional | تیره / روشن as appropriate | ○ |
| I18N-012 | Localized full play journey | E2E | Covered by `[E2E-008]` | ✓ E2E |
| I18N-013 | Persian Profile created date format | Functional | `profile-created` matches `۱۴۰۵/۵/۲۱`-style | ✓ |
| I18N-014 | Difficulty options in Persian | Functional | Easy/Medium/Hard → آسان/متوسط/سخت | ✓ |

---

## Automated in `i18n.spec.ts`

`I18N-001` … `I18N-007`, `I18N-013`, `I18N-014`

---

## Related elsewhere

| ID | Spec |
|----|------|
| SET-003 | theme + language persist together |
| HIST-007 / 021 | History Persian / English |
| E2E-008 | localized play journey |

## Known bugs

| Bug | Note |
|-----|------|
| [BUG-002](../BUGS.md#bug-002--incomplete-persian-translations) | Incomplete Persian strings (LANGUAGE label, etc.) |
| [BUG-003](../BUGS.md#bug-003--profile-created-label-not-translated) | Profile “Created” stays English |
| [BUG-004](../BUGS.md#bug-004--shell-title--subtitle-never-localize) | Title / subtitle never localize |
