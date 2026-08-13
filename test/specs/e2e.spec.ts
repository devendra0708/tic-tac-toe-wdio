import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import HistoryPage from '../pageobjects/history-page';
import ProfilePage from '../pageobjects/profile-page';
import { openFreshApp, uniqueName } from '../utils/storage';

async function finishAGame(): Promise<string | null> {
  await GamePage.difficulty.selectByAttribute('value', 'easy');
  let result: string | null = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    await GamePage.newGame();
    result = await GamePage.playUntilOver();
    if (result === 'human' || result === 'computer' || result === 'draw') {
      return result;
    }
  }
  return result;
}

describe('E2E journeys', () => {
  it('[E2E-001] register → finish game → history + profile updated', async () => {
    const name = uniqueName('E2E1');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    const result = await finishAGame();
    expect(['human', 'computer', 'draw']).toContain(result);

    await HeaderPage.goHistory();
    await HistoryPage.waitForDisplayed();
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1);
    await expect(HistoryPage.result(0)).toHaveText(
      result === 'human' ? 'Win' : result === 'computer' ? 'Loss' : 'Draw',
    );

    // Stats are derived from history — assert before clearing
    await HeaderPage.goProfile();
    await ProfilePage.waitForDisplayed();
    const total =
      Number(await ProfilePage.wins.getText()) +
      Number(await ProfilePage.losses.getText()) +
      Number(await ProfilePage.draws.getText());
    expect(total).toBeGreaterThanOrEqual(1);
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));

    await HeaderPage.goHistory();
    await HistoryPage.clear(true);
    await expect(HistoryPage.empty).toBeDisplayed();

    await HeaderPage.goProfile();
    await expect(ProfilePage.wins).toHaveText('0');
    await expect(ProfilePage.losses).toHaveText('0');
    await expect(ProfilePage.draws).toHaveText('0');
  });

  it('[E2E-002] logout → login → same account can play again', async () => {
    const name = uniqueName('E2E2');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await HeaderPage.logout();

    await AuthPage.switchMode();
    await AuthPage.login(name);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));

    await GamePage.playCell(4);
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x');
  });

  it('[E2E-003] rename profile then play; history belongs to renamed user', async () => {
    const name = uniqueName('E2E3');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    const renamed = `${name}Renamed`;
    await HeaderPage.goProfile();
    await ProfilePage.saveName(renamed);
    await expect(HeaderPage.hello).toHaveText(new RegExp(renamed));

    await HeaderPage.goPlay();
    await GamePage.waitForDisplayed();
    const result = await finishAGame();
    expect(['human', 'computer', 'draw']).toContain(result);

    await HeaderPage.goHistory();
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1);

    await HeaderPage.logout();
    await AuthPage.switchMode();
    await AuthPage.login(renamed);
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(renamed));
  });

  it('[E2E-004] accept difficulty change mid-game then finish on Easy', async () => {
    await openFreshApp();
    await AuthPage.register(uniqueName('E2E4'));
    await GamePage.waitForDisplayed();

    await GamePage.playCell(4);
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn');
    await GamePage.changeDifficulty('medium', true);
    await GamePage.waitUntilYourTurn();
    await expect(GamePage.difficulty).toHaveValue('medium');
    for (let i = 0; i < 9; i++) {
      await expect(GamePage.cell(i)).toHaveAttribute('data-state', 'empty');
    }

    const result = await finishAGame();
    expect(['human', 'computer', 'draw']).toContain(result);
    await HeaderPage.goHistory();
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1);
  });

  it('[E2E-005] dismiss difficulty confirm and dismiss delete account', async () => {
    const name = uniqueName('E2E5');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();

    await GamePage.playCell(4);
    await GamePage.changeDifficulty('hard', false);
    await expect(GamePage.difficulty).toHaveValue('easy');
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x');

    await HeaderPage.goProfile();
    await ProfilePage.deleteAccount(false);
    await ProfilePage.waitForDisplayed();
    await expect(HeaderPage.hello).toHaveText(new RegExp(name));
  });

  it('[E2E-006] delete account then re-register same name', async () => {
    const name = uniqueName('E2E6');
    await openFreshApp();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await finishAGame();

    await HeaderPage.goProfile();
    await ProfilePage.deleteAccount(true);
    await AuthPage.waitForDisplayed();

    await AuthPage.switchMode();
    await AuthPage.login(name);
    await expect(AuthPage.error).toBeDisplayed();

    await AuthPage.switchMode();
    await AuthPage.register(name);
    await GamePage.waitForDisplayed();
    await HeaderPage.goHistory();
    await expect(HistoryPage.empty).toBeDisplayed();
  });

  it('[E2E-007] two users have isolated history', async () => {
    const userA = uniqueName('UserA');
    const userB = uniqueName('UserB');

    await openFreshApp();
    await AuthPage.register(userA);
    await GamePage.waitForDisplayed();
    await finishAGame();
    await HeaderPage.goHistory();
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1);
    await HeaderPage.logout();

    await AuthPage.register(userB);
    await GamePage.waitForDisplayed();
    await HeaderPage.goHistory();
    await expect(HistoryPage.empty).toBeDisplayed();
  });

  it('[E2E-008] play flow works in Persian (RTL) then back to English', async () => {
    await openFreshApp();
    await HeaderPage.setLanguage('fa');
    await expect(await HeaderPage.dir()).toBe('rtl');

    await AuthPage.register(uniqueName('E2E8'));
    await GamePage.waitForDisplayed();
    await expect(HeaderPage.navPlay).toHaveText('بازی');
    await expect(GamePage.status).toBeDisplayed();

    await GamePage.playCell(4);
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x');

    await HeaderPage.setLanguage('en');
    await expect(await HeaderPage.dir()).toBe('ltr');
    await expect(HeaderPage.navPlay).toHaveText('Play');
  });
});
