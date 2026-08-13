import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import HistoryPage from '../pageobjects/history-page';
import ProfilePage from '../pageobjects/profile-page';
import { registerAndPlay } from '../utils/fixtures';
import { openFreshApp } from '../utils/storage';

describe('Navigation / shell', () => {
  it('[NAV-003] active nav state follows Play / Profile / History', async () => {
    await registerAndPlay('NavActive');

    await expect(HeaderPage.navPlay).toHaveAttribute('data-active', 'true');
    await expect(GamePage.view).toBeDisplayed();

    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();
    await expect(HeaderPage.navProfile).toHaveAttribute('data-active', 'true');
    await expect(HeaderPage.navPlay).not.toHaveAttribute('data-active', 'true');

    await HeaderPage.goHistory();
    await HistoryPage.waitForDisplayed();
    await expect(HeaderPage.navHistory).toHaveAttribute('data-active', 'true');
    await expect(HeaderPage.navProfile).not.toHaveAttribute('data-active', 'true');

    await HeaderPage.goPlay();
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.navPlay).toHaveAttribute('data-active', 'true');
  });

  it('[NAV-004] avatar shows first initial of the display name', async () => {
    const suffix = `${Date.now()}`;
    const name = `Sam${suffix}`;
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.avatar).toBeDisplayed();
    await expect(HeaderPage.avatar).toHaveText('S');
  });

  it('[NAV-006] title and subtitle branding are visible on the shell', async () => {
    await openFreshApp();
    await AuthPage.waitForDisplayed();
    await expect(HeaderPage.title).toHaveText('Tic-Tac-Toe');
    await expect(HeaderPage.subtitle).toHaveText('A small game for test automation');
  });

  it('[NAV-008] navigating tabs keeps the session', async () => {
    const name = await registerAndPlay('NavTabs');
    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();
    await HeaderPage.goHistory();
    await HistoryPage.waitForDisplayed();
    await HeaderPage.goPlay();
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));
    await expect(AuthPage.form).not.toBeDisplayed();
  });

  it('[NAV-010] Play → History → Play keeps account and returns to Play', async () => {
    const name = await registerAndPlay('NavLoop');
    await GamePage.playCell(4);
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x');
    await HeaderPage.goHistory();
    await HistoryPage.waitForDisplayed();
    await HeaderPage.goPlay();
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));
    await expect(GamePage.view).toBeDisplayed();
  });
});
