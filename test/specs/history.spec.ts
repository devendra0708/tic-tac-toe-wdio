import AuthPage from '../pageobjects/auth-page'
import GamePage from '../pageobjects/game-page'
import HeaderPage from '../pageobjects/header-page'
import HistoryPage from '../pageobjects/history-page'
import ProfilePage from '../pageobjects/profile-page'
import { openFreshApp, uniqueName } from '../utils/storage'

async function registerFresh() {
  await openFreshApp()
  await AuthPage.register(uniqueName('Hist'))
  await GamePage.waitForDisplayed()
}

async function finishAGame(): Promise<string | null> {
  await HeaderPage.goPlay()
  await GamePage.waitForDisplayed()
  await GamePage.difficulty.selectByAttribute('value', 'easy')
  let result: string | null = null
  for (let attempt = 0; attempt < 6; attempt++) {
    await GamePage.newGame()
    result = await GamePage.playUntilOver()
    if (result === 'human' || result === 'computer' || result === 'draw') {
      return result
    }
  }
  return result
}

function expectedResultLabel(status: string | null) {
  if (status === 'human') return 'Win'
  if (status === 'computer') return 'Loss'
  return 'Draw'
}

function expectedResultAttr(status: string | null) {
  if (status === 'human') return 'win'
  if (status === 'computer') return 'loss'
  return 'draw'
}

describe('History', () => {
  it('[HIST-001] shows empty state and no Clear button for a new user', async () => {
    await registerFresh()
    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()

    await expect(HistoryPage.title).toHaveText('Game History')
    await expect(HistoryPage.empty).toBeDisplayed()
    await expect(await HistoryPage.empty.getText()).toMatch(/No games yet/i)
    await expect(HistoryPage.table).not.toBeDisplayed()
    await expect(HistoryPage.clearBtn).not.toBeDisplayed()
    await expect(HeaderPage.navHistory).toHaveAttribute('data-active', 'true')
  })

  it('[HIST-002] does not record an unfinished game', async () => {
    await registerFresh()
    await GamePage.playCell(4)
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x')

    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()
    await expect(HistoryPage.empty).toBeDisplayed()
    await expect(await HistoryPage.rowCount()).toBe(0)
  })

  it('[HIST-003] records date, difficulty, result after a finished game', async () => {
    await registerFresh()
    const status = await finishAGame()
    expect(['human', 'computer', 'draw']).toContain(status)

    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()
    await expect(HistoryPage.table).toBeDisplayed()
    await expect(await HistoryPage.rowCount()).toBe(1)

    await expect(HistoryPage.date(0)).toBeDisplayed()
    await expect(await HistoryPage.date(0).getText()).not.toBe('')
    await expect(HistoryPage.difficulty(0)).toHaveText('Easy')
    await expect(HistoryPage.result(0)).toHaveText(expectedResultLabel(status))
    await expect(await HistoryPage.rowResultAttr(0)).toBe(
      expectedResultAttr(status),
    )
    await expect(HistoryPage.clearBtn).toBeDisplayed()
  })

  it('[HIST-004] accumulates multiple games with newest first', async () => {
    await registerFresh()
    const first = await finishAGame()
    expect(['human', 'computer', 'draw']).toContain(first)
    const second = await finishAGame()
    expect(['human', 'computer', 'draw']).toContain(second)

    await HeaderPage.goHistory()
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(2)

    // Newest finish is row-0
    await expect(HistoryPage.result(0)).toHaveText(expectedResultLabel(second))
    await expect(await HistoryPage.rowResultAttr(0)).toBe(
      expectedResultAttr(second),
    )
    await expect(HistoryPage.result(1)).toHaveText(expectedResultLabel(first))
  })

  it('[HIST-005] Clear History accept empties the list and zeros profile stats', async () => {
    await registerFresh()
    await finishAGame()

    await HeaderPage.goHistory()
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1)

    await HistoryPage.clear(true)
    await expect(HistoryPage.empty).toBeDisplayed()
    await expect(HistoryPage.clearBtn).not.toBeDisplayed()

    await HeaderPage.goProfile()
    await ProfilePage.waitForDisplayed()
    await expect(ProfilePage.wins).toHaveText('0')
    await expect(ProfilePage.losses).toHaveText('0')
    await expect(ProfilePage.draws).toHaveText('0')
  })

  it('[HIST-006] Clear History dismiss keeps existing rows', async () => {
    await registerFresh()
    await finishAGame()

    await HeaderPage.goHistory()
    const before = await HistoryPage.rowCount()
    expect(before).toBeGreaterThanOrEqual(1)

    await HistoryPage.clear(false)

    await expect(await HistoryPage.rowCount()).toBe(before)
    await expect(HistoryPage.empty).not.toBeDisplayed()
    await expect(HistoryPage.clearBtn).toBeDisplayed()
  })

  it('[HIST-007] History labels switch to Persian when language is Persian', async () => {
    await registerFresh()
    await HeaderPage.setLanguage('fa')
    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()

    await expect(await HeaderPage.dir()).toBe('rtl')
    await expect(HistoryPage.title).toBeDisplayed()
    await expect(await HistoryPage.title.getText()).not.toBe('Game History')
    await expect(HistoryPage.empty).toBeDisplayed()
    await expect(HistoryPage.empty).toHaveText('هنوز بازی‌ای انجام نشده است.')
  })

  it('[HIST-014] History survives reload in the same session', async () => {
    await registerFresh()
    const result = await finishAGame()
    expect(['human', 'computer', 'draw']).toContain(result)

    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()
    await expect(await HistoryPage.rowCount()).toBe(1)
    const label = expectedResultLabel(result)
    await expect(HistoryPage.result(0)).toHaveText(label)

    await browser.refresh()
    await GamePage.waitForDisplayed()
    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()
    await expect(await HistoryPage.rowCount()).toBe(1)
    await expect(HistoryPage.result(0)).toHaveText(label)
  })
})
