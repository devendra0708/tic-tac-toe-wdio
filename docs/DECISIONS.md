# Decisions — Test Automation

Short rationale for choices in this WebdriverIO suite. Newest items reflect current practice.

---

## DEC-1 — Framework: WebdriverIO + Mocha + TypeScript

**Decision:** Automate the SUT with WebdriverIO 9, Mocha BDD, and TypeScript.

**Why:**
- Matches a common SDET take-home stack and keeps config/locator typing safer than plain JS.
- Mocha stays thin; `expect-webdriverio` covers UI assertions.
- WDIO’s static-server service can host `app/` without a separate process for local runs.

---

## DEC-2 — Locators and waits

**Decision:** Prefer `[data-testid="…"]` for every interaction. Wait on SUT state (`data-status`, `data-state`, displayed/enabled), not fixed sleeps.

**Why:**
- The SUT already exposes stable test ids.
- Persian/RTL changes most visible copy; text/CSS selectors would be brittle.
- Computer moves are async (~thinking status); waiting on `data-status` is deterministic.

---

## DEC-3 — Page objects + BasePage

**Decision:** One page object per major surface (Auth, Header, Game, Profile, History), all extending `BasePage`.

**Why:**
- Keeps locators/actions near the UI they own.
- `BasePage` centralizes `data-testid` helpers, display waits, and native-confirm accept/dismiss/stub helpers used by History/Profile (and available to specs).

---

## DEC-4 — Native `window.confirm` handling

**Decision:** Always stub `window.confirm` (via `BasePage.stubConfirm`) before Clear History, Delete Account, and mid-game difficulty changes. Assert exact English confirm copy from `__lastConfirm` where the case owns that copy (DIFF-001 / DIFF-004). Keep WDIO alert helpers on `BasePage` only as a fallback — do not use them in CI paths.

**Why:**
- Headless Chrome on GitHub Actions races `getAlertText` / `acceptAlert` (`no such alert`), which failed HIST-005, PROF-003, DIFF-001, and related E2E cases.
- Stubbing makes OK/Cancel deterministic and still lets us assert the confirm message.

---

## DEC-5 — Finished-game assertions use Easy

**Decision:** When a test must finish a game (history row, stats), force **Easy** and retry a small number of playthroughs.

**Why:** Hard (and often Medium) AI play is near-optimal; forcing a human win is brittle. Easy keeps outcomes reachable without seeding internal board state.

---

## DEC-6 — Allure + Spec reporters

**Decision:** Spec reporter for console; `@wdio/allure-reporter` for archived HTML. Failed tests attach a screenshot. CI uploads `allure-report/` (and raw `allure-results/`) as artifacts even when the suite is red.

**Why:**
- Spec is enough for local iteration.
- Allure gives reviewers a browsable run without re-running locally (download the artifact from the Actions run). Generating HTML needs Java (local or CI `setup-java`).

---

## DEC-7 — CI headless Chrome

**Decision:** Enable `--headless=new` (and CI-friendly Chrome flags) when `CI=true`; keep headed locally by default.

**Why:** GitHub-hosted runners have no display; local debugging is easier headed.

---

## DEC-8 — Docs layout

**Decision:** Keep a living case inventory under `docs/test-cases/` + `TEST_CASES_SUMMARY.md`, product issues in `BUGS.md`, and this file for automation rationale.

**Why:** Separates “what to test / what is automated” from “what is wrong in the SUT” from “why the suite is built this way” — the path reviewers usually want.

---

*Add new DEC entries when a non-obvious choice is locked in.*
