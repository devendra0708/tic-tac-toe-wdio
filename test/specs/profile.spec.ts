import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import ProfilePage from '../pageobjects/profile-page';
import { openFreshApp, uniqueName } from '../utils/storage';

describe('Profile', () => {
  it('[PROF-001] shows stats and renames successfully', async () => {
    const name = uniqueName('Pat');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();
    await expect(ProfilePage.title).toHaveText('Your Profile');
    await expect(ProfilePage.wins).toHaveText('0');
    await expect(ProfilePage.losses).toHaveText('0');
    await expect(ProfilePage.draws).toHaveText('0');
    await expect(ProfilePage.created).toBeDisplayed();

    const renamed = `${name}X`;
    await ProfilePage.saveName(renamed);
    await expect(ProfilePage.message).toBeDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(renamed));
  });

  it('[PROF-002] rejects whitespace-only profile name', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('Short'));
    await GamePage.waitForDisplayed();
    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();

    // Spaces satisfy HTML minlength=2 but fail app-side trim → empty name
    await browser.execute(() => {
      const input = document.querySelector(
        '[data-testid="input-profile-name"]',
      ) as HTMLInputElement;
      input.value = '  ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await ProfilePage.saveBtn.click();
    await expect(ProfilePage.error).toBeDisplayed();
    await expect(await ProfilePage.error.getText()).toMatch(/enter a name|at least 2/i);
  });

  it('[PROF-003] delete account returns to auth and blocks login', async () => {
    const name = uniqueName('Del');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();

    await ProfilePage.deleteAccount(true);
    await AuthPage.waitForDisplayed();

    await AuthPage.switchMode();
    await AuthPage.login(name);
    await expect(AuthPage.error).toBeDisplayed();
  });

  it('[PROF-007] rejects rename to an existing user name', async () => {
    const first = uniqueName('First');
    const second = uniqueName('Second');
    await openFreshApp();
    await AuthPage.register(first);
    await GamePage.waitForDisplayed();
    await HeaderPage.logout();

    await AuthPage.register(second);
    await GamePage.waitForDisplayed();
    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();

    await ProfilePage.saveName(first);
    await expect(ProfilePage.error).toBeDisplayed();
    await expect(await ProfilePage.error.getText()).toMatch(/already uses this name/i);
    await expect(HeaderPage.hello).toHaveText(new RegExp(second));
  });

  it('[PROF-008] rename updates avatar initial', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('Ann'));
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.avatar).toHaveText('A');

    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();
    await ProfilePage.saveName(uniqueName('Bob'));
    await expect(HeaderPage.avatar).toHaveText('B');
  });
});
