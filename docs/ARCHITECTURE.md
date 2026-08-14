# Architecture — Test Automation

How this WebdriverIO suite is structured and why. Each section is a locked-in design choice (newest items reflect current practice).

---

## ARCH-1 — Framework: WebdriverIO + Mocha + TypeScript

**Choice:** Automate the SUT with WebdriverIO 9, Mocha BDD, and TypeScript.

**Why:**
- Matches a common SDET take-home stack and keeps config/locator typing safer than plain JS.
- Mocha stays thin; `expect-webdriverio` covers UI assertions.
- WDIO’s static-server service can host `app/` without a separate process for local runs.

---

## ARCH-2 — Locators and waits

**Choice:** Prefer `[data-testid="…"]` for every interaction. Wait on SUT state (`data-status`, `data-state`, displayed/enabled), not fixed sleeps.

**Why:**
- The SUT already exposes stable test ids.
- Persian/RTL changes most visible copy; text/CSS selectors would be brittle.
- Computer moves are async (~thinking status); waiting on `data-status` is deterministic.

---

## ARCH-3 — Page objects + BasePage

**Choice:** One page object per major surface (Auth, Header, Game, Profile, History), all extending `BasePage`.

**Why:**
- Keeps locators/actions near the UI they own.
- `BasePage` centralizes `data-testid` helpers, display waits, and native-confirm accept/dismiss/stub helpers used by History/Profile (and available to specs).

---

## ARCH-4 — Native `window.confirm` handling

**Choice:** Always stub `window.confirm` (via `BasePage.stubConfirm`) before Clear History, Delete Account, and mid-game difficulty changes. Assert exact English confirm copy from `__lastConfirm` where the case owns that copy (DIFF-001 / DIFF-004). Keep WDIO alert helpers on `BasePage` only as a fallback — do not use them in CI paths.

**Why:**
- Headless Chrome on GitHub Actions races `getAlertText` / `acceptAlert` (`no such alert`), which failed HIST-005, PROF-003, DIFF-001, and related E2E cases.
- Stubbing makes OK/Cancel deterministic and still lets us assert the confirm message.

---

## ARCH-5 — Finished-game assertions use Easy

**Choice:** When a test must finish a game (history row, stats), force **Easy** and retry a small number of playthroughs.

**Why:** Hard (and often Medium) AI play is near-optimal; forcing a human win is brittle. Easy keeps outcomes reachable without seeding internal board state.

---

## ARCH-6 — Allure + Spec reporters

**Choice:** Spec reporter for console; `@wdio/allure-reporter` for archived HTML. Failed tests attach a screenshot. CI uploads `allure-report/` (and raw `allure-results/`) as artifacts even when the suite is red.

**Why:**
- Spec is enough for local iteration.
- Allure gives reviewers a browsable run without re-running locally (download the artifact from the Actions run). Generating HTML needs Java (local or CI `setup-java`).

---

## ARCH-7 — CI headless Chrome

**Choice:** Enable `--headless=new` (and CI-friendly Chrome flags) when `CI=true`; keep headed locally by default.

**Why:** GitHub-hosted runners have no display; local debugging is easier headed.

---

## ARCH-8 — Docs layout

**Choice:** Keep a living case inventory under `docs/test-cases/` + `TEST_CASES_SUMMARY.md`, product issues in `BUGS.md`, and this file for suite architecture / rationale.

**Why:** Separates “what to test / what is automated” from “what is wrong in the SUT” from “how/why the suite is built” — the path reviewers usually want.

---

## ARCH-9 — Docker single-image test run

**Choice:** Ship `Dockerfile.tests` + `compose.yml` with one `tests` service (`npm run docker:test`). No separate app container — WDIO’s static-server hosts `app/` inside the same image. Chromium, chromedriver, and JRE live in the image; Allure HTML is written to a host-mounted `allure-report/`.

**Why:**
- Reviewers can run the suite without installing Chrome or Java on the host.
- A second app image (as in some reference repos) adds compose wiring we do not need because the SUT is already served by WDIO.
- `CHROME_BIN` / `CHROMEDRIVER_BIN` in `wdio.conf.ts` point at the Debian Chromium packages only when those env vars are set (local headed Chrome stays unchanged).

---

## ARCH-10 — ESLint + Prettier in CI

**Choice:** Flat ESLint (`eslint.config.mjs` + `typescript-eslint`) and Prettier (2-space, single quotes) on `test/**` and `wdio.conf.ts`. CI runs `lint` and `format:check` before `npm test`. Ignore `app/` (SUT) and generated Allure folders.

**Why:** Catches unused/unsafe TypeScript and formatting drift before E2E burns CI minutes; keeps the take-home handoff consistent for reviewers.

---

## ARCH-11 — Live Allure on GitHub Pages

**Choice:** After CI generates `allure-report/`, upload it with `actions/upload-pages-artifact` and deploy from `main`/`master` via `actions/deploy-pages` (job `publish-report`). The publish job uses `always()` so a **red** suite still updates the live site when a report was produced. Artifacts remain available on every PR/push.

**Why:** Reviewers get a clickable URL for the latest main-branch report without downloading zips — especially useful when CI is red. Requires repo **Settings → Pages → Source: GitHub Actions**. Live URL: `https://devendra0708.github.io/tic-tac-toe-wdio/`.

---

## ARCH-12 — Shared fixtures

**Choice:** Common setup lives in `test/utils/fixtures.ts` (`registerAndPlay`, `finishEasyGame`, result label helpers) beside `storage.ts`.

**Why:** Removes duplicated register/finish helpers across game/history/e2e specs and keeps Easy-retry finish behavior consistent.

---

## ARCH-13 — Parallel workers

**Choice:** Default `maxInstances` to `min(4, cpus-1)` locally and **2 in CI**; override with `WDIO_MAX_INSTANCES`. The static-server is a WDIO **launcher** (one port for all workers); browser sessions isolate `localStorage`.

**Why:** Cuts wall-clock without serving the SUT multiple times. CI caps at 2 because packing ~8 Chromes on a GitHub runner shortens the `computer-thinking` window and flakes timing assertions (GAME-008). Use `WDIO_MAX_INSTANCES=1` when debugging flakes.

---

*Add new ARCH entries when a non-obvious structural choice is locked in.*
