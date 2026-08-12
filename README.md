# Tic-Tac-Toe — WebdriverIO + TypeScript

WebdriverIO + TypeScript E2E suite for a single-file Tic-Tac-Toe app.

**SUT:** [`app/index.html`](app/index.html)  
**URLs:** tests use `http://127.0.0.1:4567` (WDIO static server); manual explore with `npm run serve` → `http://127.0.0.1:8080`

## Prerequisites

- Node.js 18+
- Chrome
- Java 8+ (for Allure report generation)

## Setup

```bash
npm install
```

## Run tests

```bash
npm test                 # all specs (auth, game, profile, history, settings, i18n, e2e)
npm run test:auth
npm run test:game
npm run test:profile
npm run test:history
npm run test:settings
npm run test:i18n
npm run test:e2e
```

## Reports (Allure)

Tests write raw results to `allure-results/` (cleared at the start of each run). Failed tests attach a screenshot.

```bash
npm run report           # generate HTML + open
npm run report:generate  # generate only → allure-report/
npm run report:open      # open existing allure-report/
npm run report:serve     # generate temp report and serve
```

## Docs

- [Test cases summary](docs/TEST_CASES_SUMMARY.md) — all cases + coverage counts
- [Section catalogs](docs/test-cases/README.md) — AUTH / GAME / HIST / …
- [Known bugs](docs/BUGS.md) — SUT issues from exploration

## Layout

```
app/
  index.html           # SUT
docs/
  TEST_CASES_SUMMARY.md
  BUGS.md
  test-cases/          # per-section catalogs
wdio.conf.ts
test/
  pageobjects/         # Auth, Game, Profile, History, Header
  specs/               # auth, game, profile, history, settings, i18n, e2e
  utils/storage.ts     # fresh localStorage helpers
```
