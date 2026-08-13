import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import { openFreshApp, uniqueName } from '../utils/storage';

describe('Settings', () => {
  it('[SET-001] toggles light/dark theme', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('Set'));
    await GamePage.waitForDisplayed();

    await expect(await HeaderPage.theme()).toBe('light');
    await expect(HeaderPage.themeBtn).toHaveText('Dark');

    await HeaderPage.toggleTheme();
    await expect(await HeaderPage.theme()).toBe('dark');
    await expect(HeaderPage.themeBtn).toHaveText('Light');

    await HeaderPage.toggleTheme();
    await expect(await HeaderPage.theme()).toBe('light');
  });

  it('[SET-002] theme persists after reload', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('Set'));
    await GamePage.waitForDisplayed();

    await HeaderPage.toggleTheme();
    await expect(await HeaderPage.theme()).toBe('dark');
    await browser.refresh();
    await GamePage.waitForDisplayed();
    await expect(await HeaderPage.theme()).toBe('dark');
  });

  it('[SET-003] theme and language persist together after reload', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('Set'));
    await GamePage.waitForDisplayed();

    await HeaderPage.toggleTheme();
    await HeaderPage.setLanguage('fa');
    await browser.refresh();
    await GamePage.waitForDisplayed();
    await expect(await HeaderPage.theme()).toBe('dark');
    await expect(await HeaderPage.lang()).toBe('fa');
    await expect(await HeaderPage.dir()).toBe('rtl');
  });

  it('[SET-005] theme is usable on the auth screen before register', async () => {
    await openFreshApp();
    await AuthPage.waitForDisplayed();
    await expect(await HeaderPage.theme()).toBe('light');
    await HeaderPage.toggleTheme();
    await expect(await HeaderPage.theme()).toBe('dark');
    await expect(HeaderPage.themeBtn).toHaveText('Light');
    await expect(AuthPage.form).toBeDisplayed();
  });
});
