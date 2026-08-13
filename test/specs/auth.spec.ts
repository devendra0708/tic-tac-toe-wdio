import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import { openFreshApp, uniqueName } from '../utils/storage';

describe('Auth', () => {
  beforeEach(async () => {
    await openFreshApp();
  });

  it('[AUTH-001] registers a new user and lands on Play', async () => {
    const name = uniqueName('Alice');
    await AuthPage.waitForDisplayed();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'register');
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));
    await expect(HeaderPage.navPlay).toBeDisplayed();
  });

  it('[AUTH-002] shows error when name is empty', async () => {
    await AuthPage.waitForDisplayed();
    await AuthPage.submitEmptyRegister();
    await expect(AuthPage.error).toBeDisplayed();
    await expect(AuthPage.error).toHaveText('Please enter a name.');
    await expect(AuthPage.form).toBeDisplayed();
  });

  it('[AUTH-003] shows error when name is too short', async () => {
    await AuthPage.waitForDisplayed();
    await AuthPage.register('A');
    await expect(AuthPage.error).toHaveText('Name must be at least 2 characters.');
  });

  it('[AUTH-004] rejects duplicate registration', async () => {
    const name = uniqueName('Dup');
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await HeaderPage.logout();
    await AuthPage.waitForDisplayed();
    await AuthPage.register(name);
    await expect(AuthPage.error).toBeDisplayed();
    await expect(await AuthPage.error.getText()).toMatch(/already/i);
  });

  it('[AUTH-005] switches to login, rejects unknown user, then logs in', async () => {
    const name = uniqueName('Bob');
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await HeaderPage.logout();

    await AuthPage.switchMode();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'login');
    await expect(AuthPage.loginBtn).toBeDisplayed();

    await AuthPage.login('NobodyXYZ');
    await expect(AuthPage.error).toBeDisplayed();
    await expect(await AuthPage.error.getText()).toMatch(/no account|register/i);

    await AuthPage.login(name);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));
  });

  it('[AUTH-006] keeps session on reload and clears it on logout', async () => {
    const name = uniqueName('Sam');
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    await browser.refresh();
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));

    await HeaderPage.logout();
    await AuthPage.waitForDisplayed();
    await browser.refresh();
    await AuthPage.waitForDisplayed();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'register');
  });

  it('[AUTH-010] rejects whitespace-only register name', async () => {
    await AuthPage.waitForDisplayed();
    await AuthPage.nameInput.setValue('   ');
    await AuthPage.registerBtn.click();
    await expect(AuthPage.error).toBeDisplayed();
    await expect(AuthPage.error).toHaveText('Please enter a name.');
    await expect(AuthPage.form).toBeDisplayed();
  });

  it('[AUTH-011] trims leading and trailing spaces on register', async () => {
    const core = uniqueName('Trim');
    await AuthPage.waitForDisplayed();
    await AuthPage.register(`  ${core}  `);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(`Hello, ${core}`);

    await HeaderPage.logout();
    await AuthPage.switchMode();
    await AuthPage.login(core);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(`Hello, ${core}`);
  });

  it('[AUTH-008] switches from login back to register', async () => {
    await AuthPage.waitForDisplayed();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'register');
    await AuthPage.switchMode();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'login');
    await AuthPage.switchMode();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'register');
    await expect(AuthPage.registerBtn).toBeDisplayed();
  });

  it('[AUTH-015] error clears when switching mode', async () => {
    await AuthPage.waitForDisplayed();
    await AuthPage.submitEmptyRegister();
    await expect(AuthPage.error).toBeDisplayed();
    await AuthPage.switchMode();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'login');
    await expect(AuthPage.error).not.toBeDisplayed();
  });

  it('[AUTH-016] shows error when login name is empty', async () => {
    await AuthPage.waitForDisplayed();
    await AuthPage.switchMode();
    await expect(AuthPage.form).toHaveAttribute('data-mode', 'login');
    await AuthPage.submitEmptyLogin();
    await expect(AuthPage.error).toBeDisplayed();
    await expect(AuthPage.error).toHaveText('Please enter a name.');
  });

  it('[STOR-001][STOR-002] persists users and session keys after register', async () => {
    const name = uniqueName('Stor');
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    const storage = await browser.execute(() => {
      const out: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) out[key] = localStorage.getItem(key);
      }
      return out;
    });
    const keys = Object.keys(storage);
    const usersKey = keys.find(
      (k) => k.toLowerCase().includes('user') && storage[k]?.includes(name),
    );
    const sessionKey = keys.find(
      (k) =>
        k.toLowerCase().includes('session') ||
        storage[k] === name ||
        storage[k]?.includes(`"${name}"`),
    );
    expect(usersKey).toBeTruthy();
    expect(sessionKey).toBeTruthy();
  });
});
