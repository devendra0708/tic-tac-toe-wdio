# Tic-Tac-Toe — WebdriverIO + TypeScript

Automated tests for the single-file SUT (`app/index.html`).

## Prerequisites

- Node.js 18+
- Chrome

## Setup

```bash
npm install
```

## Run tests

```bash
npm test                 # all specs (auth, game, profile, settings, i18n, e2e)
npm run test:auth
npm run test:game
npm run test:profile
npm run test:history
npm run test:settings
npm run test:i18n
npm run test:e2e
```

The WDIO static-server service serves `app/` at `http://127.0.0.1:4567`.

## Layout

```
app/
  index.html           # SUT
docs/
  INSTRUCTIONS.md
  TEST_CASES_SUMMARY.md  # all cases in one place
  BUGS.md                # known SUT bugs / issues
  test-cases/            # per-section AUTH/GAME/HIST/… catalogs
wdio.conf.ts
test/
  pageobjects/         # Auth, Game, Profile, History, Header
  specs/               # auth, game, profile, settings, i18n, e2e
  utils/storage.ts     # fresh localStorage helpers
```

## Notes

- Locators use `data-testid` attributes from the SUT.
- Computer moves are async; game helpers wait on `data-status` rather than fixed sleeps alone.
- Easy difficulty is used when asserting a finished game (Hard AI is near-optimal / brittle to force-win).
