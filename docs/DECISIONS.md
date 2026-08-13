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

## DEC-9 — Docker single-image test run

**Decision:** Ship `Dockerfile.tests` + `compose.yml` with one `tests` service (`npm run docker:test`). No separate app container — WDIO’s static-server hosts `app/` inside the same image. Chromium, chromedriver, and JRE live in the image; Allure HTML is written to a host-mounted `allure-report/`.

**Why:**
- Reviewers can run the suite without installing Chrome or Java on the host.
- A second app image (as in some reference repos) adds compose wiring we do not need because the SUT is already served by WDIO.
- `CHROME_BIN` / `CHROMEDRIVER_BIN` in `wdio.conf.ts` point at the Debian Chromium packages only when those env vars are set (local headed Chrome stays unchanged).

---

## DEC-10 — ESLint + Prettier in CI

**Decision:** Flat ESLint (`eslint.config.mjs` + `typescript-eslint`) and Prettier (2-space, single quotes) on `test/**` and `wdio.conf.ts`. CI runs `lint` and `format:check` before `npm test`. Ignore `app/` (SUT) and generated Allure folders.

**Why:** Catches unused/unsafe TypeScript and formatting drift before E2E burns CI minutes; keeps the take-home handoff consistent for reviewers.

---

## DEC-11 — Live Allure on GitHub Pages

**Decision:** After CI generates `allure-report/`, upload it with `actions/upload-pages-artifact` and deploy from `main`/`master` via `actions/deploy-pages` (job `publish-report`). Artifacts remain available on every PR/push.

**Why:** Reviewers get a clickable URL for the latest main-branch report without downloading zips. Requires repo **Settings → Pages → Source: GitHub Actions**.

---

## DEC-12 — Shared fixtures

**Decision:** Common setup lives in `test/utils/fixtures.ts` (`registerAndPlay`, `finishEasyGame`, result label helpers) beside `storage.ts`.

**Why:** Removes duplicated register/finish helpers across game/history/e2e specs and keeps Easy-retry finish behavior consistent.

---

## DEC-13 — Parallel workers

**Decision:** Default `maxInstances` to `min(4, cpus-1)`; override with `WDIO_MAX_INSTANCES`. The static-server is a WDIO **launcher** (one port for all workers); browser sessions isolate `localStorage`.

**Why:** Cuts wall-clock on multi-core machines/CI without serving the SUT multiple times. Use `WDIO_MAX_INSTANCES=1` when debugging flakes.

---

*Add new DEC entries when a non-obvious choice is locked in.*
