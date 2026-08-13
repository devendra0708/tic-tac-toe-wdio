import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const staticPort = Number(process.env.WDIO_STATIC_PORT || 4567);
const allureResultsDir = path.join(root, 'allure-results');
const isCI = process.env.CI === 'true' || process.env.CI === '1';

const chromeArgs = [
  '--disable-gpu',
  '--window-size=1280,900',
  '--no-sandbox',
  '--disable-dev-shm-usage',
];
if (isCI) {
  chromeArgs.unshift('--headless=new');
}

const chromeOptions: WebdriverIO.Capabilities['goog:chromeOptions'] = {
  args: chromeArgs,
};
if (process.env.CHROME_BIN) {
  chromeOptions.binary = process.env.CHROME_BIN;
}

const capability: WebdriverIO.Capabilities = {
  browserName: 'chrome',
  'goog:chromeOptions': chromeOptions,
};
if (process.env.CHROMEDRIVER_BIN) {
  capability['wdio:chromedriverOptions'] = {
    binary: process.env.CHROMEDRIVER_BIN,
  };
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  capabilities: [capability],

  cacheDir: path.join(root, '.wdio-cache'),

  logLevel: 'warn',
  bail: 0,
  baseUrl: `http://127.0.0.1:${staticPort}`,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  specFileRetries: isCI ? 1 : 0,
  specFileRetriesDeferred: true,

  services: [
    [
      'static-server',
      {
        folders: [{ mount: '/', path: path.join(root, 'app') }],
        port: staticPort,
      },
    ],
  ],

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: allureResultsDir,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        disableMochaHooks: true,
        reportedEnvironmentVars: {
          NODE_VERSION: process.version,
          BROWSER: 'chrome',
          BASE_URL: `http://127.0.0.1:${staticPort}`,
          CI: String(isCI),
        },
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  onPrepare() {
    fs.rmSync(allureResultsDir, { recursive: true, force: true });
  },

  afterTest: async function (_test, _context, { error }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },
};
