import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname
const staticPort = Number(process.env.WDIO_STATIC_PORT || 4567)

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          // '--headless=new',
          '--disable-gpu',
          '--window-size=1280,900',
          '--no-sandbox',
        ],
      },
    },
  ],

  cacheDir: path.join(root, '.wdio-cache'),

  logLevel: 'warn',
  bail: 0,
  baseUrl: `http://127.0.0.1:${staticPort}`,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

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
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
}
