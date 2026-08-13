# Tic-Tac-Toe — WebdriverIO + TypeScript

WebdriverIO + TypeScript E2E suite for a single-file Tic-Tac-Toe app.

**SUT:** [`app/index.html`](app/index.html)  
**URLs:** tests use `http://127.0.0.1:4567` (WDIO static server); manual explore with `npm run serve` → `http://127.0.0.1:8080`

## For reviewers — suggested read order

1. [`docs/TEST_CASES_SUMMARY.md`](docs/TEST_CASES_SUMMARY.md) — full case inventory + automation counts  
2. [`docs/test-cases/`](docs/test-cases/README.md) — per-area catalogs (AUTH / GAME / HIST / …)  
3. [`docs/BUGS.md`](docs/BUGS.md) — product defects found in exploration  
4. [`docs/DECISIONS.md`](docs/DECISIONS.md) — why the suite is built this way  
5. [`test/specs/`](test/specs/) — automated specs (`[ID]` in each `it` title)

CI runs on every push/PR: typecheck → lint → format check → E2E suite + Allure HTML uploaded as the **`allure-report`** artifact (also raw **`allure-results`**). Download from the Actions run — no local Java required to *view* a generated report if you serve the artifact folder (e.g. `npx http-server allure-report -o`).

## Prerequisites

- Node.js 18+
- Chrome (local runs; CI uses headless Chrome) — **or** Docker for `npm run docker:test`
- Java 8+ only if you generate Allure HTML locally (not needed for Docker or CI artifacts)

## Setup

```bash
npm install
```

## Run tests

```bash
npm test                 # all specs (auth, game, profile, history, settings, i18n, e2e)
npm run typecheck
npm run lint
npm run format:check
npm run test:auth
npm run test:game
npm run test:profile
npm run test:history
npm run test:settings
npm run test:i18n
npm run test:e2e
```

Set `CI=true` to force headless Chrome (same as GitHub Actions).

### Docker (no host Chrome/Java)

```bash
npm run docker:test      # build image, run suite, write ./allure-report
```

Uses Chromium + JRE inside the image; WDIO still serves `app/` via its static-server. Requires Docker Desktop (or compatible engine).

## Lint & format

```bash
npm run lint             # ESLint (test/** + wdio.conf.ts)
npm run lint:fix
npm run format           # Prettier write
npm run format:check
```

## Reports (Allure)

Tests write raw results to `allure-results/` (cleared at the start of each run). Failed tests attach a screenshot.

```bash
npm run report           # generate HTML + open (needs Java)
npm run report:generate  # generate only → allure-report/
npm run report:open      # open existing allure-report/
npm run report:serve     # generate temp report and serve
```

## Docs

- [Test cases summary](docs/TEST_CASES_SUMMARY.md) — all cases + coverage counts  
- [Section catalogs](docs/test-cases/README.md) — AUTH / GAME / HIST / …  
- [Known bugs](docs/BUGS.md) — SUT issues from exploration  
- [Decisions](docs/DECISIONS.md) — automation design choices  

## Layout

```
app/
  index.html           # SUT
docs/
  TEST_CASES_SUMMARY.md
  BUGS.md
  DECISIONS.md
  test-cases/          # per-section catalogs
.github/workflows/
  ci.yml               # typecheck, lint, format, E2E + Allure artifacts
Dockerfile.tests
compose.yml
wdio.conf.ts
test/
  pageobjects/         # BasePage + Auth, Game, Profile, History, Header
  specs/               # auth, game, profile, history, settings, i18n, e2e
  utils/storage.ts     # fresh localStorage helpers
```
