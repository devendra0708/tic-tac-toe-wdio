import AuthPage from '../pageobjects/auth-page';
import GamePage from '../pageobjects/game-page';
import HeaderPage from '../pageobjects/header-page';
import { openFreshApp, uniqueName } from './storage';

/** Register a fresh user and land on Play. */
export async function registerAndPlay(prefix = 'User'): Promise<string> {
  const name = uniqueName(prefix);
  await openFreshApp();
  await AuthPage.register(name);
  await GamePage.waitForDisplayed();
  return name;
}

/**
 * Finish a game on Easy (retries a few playthroughs).
 * Assumes the user is already logged in; navigates to Play first when `goPlay` is true.
 */
export async function finishEasyGame(
  options: { goPlay?: boolean; maxAttempts?: number } = {},
): Promise<string | null> {
  const { goPlay = false, maxAttempts = 6 } = options;
  if (goPlay) {
    await HeaderPage.goPlay();
    await GamePage.waitForDisplayed();
  }
  await GamePage.difficulty.selectByAttribute('value', 'easy');
  let result: string | null = null;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await GamePage.newGame();
    result = await GamePage.playUntilOver();
    if (result === 'human' || result === 'computer' || result === 'draw') {
      return result;
    }
  }
  return result;
}

export function expectedResultLabel(status: string | null): string {
  if (status === 'human') return 'Win';
  if (status === 'computer') return 'Loss';
  return 'Draw';
}

export function expectedResultAttr(status: string | null): string {
  if (status === 'human') return 'win';
  if (status === 'computer') return 'loss';
  return 'draw';
}
