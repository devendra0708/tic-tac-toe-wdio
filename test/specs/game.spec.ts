import AuthPage from '../pageobjects/auth-page'
import GamePage from '../pageobjects/game-page'
import HeaderPage from '../pageobjects/header-page'
import HistoryPage from '../pageobjects/history-page'
import ProfilePage from '../pageobjects/profile-page'
import { openFreshApp, uniqueName } from '../utils/storage'

async function registerAndPlay() {
  const name = uniqueName('Gamer')
  await openFreshApp()
  await AuthPage.register(name)
  await GamePage.waitForDisplayed()
  return name
}

describe('Game', () => {
  it('[GAME-001] places X, computer replies with O, occupied cell stays locked', async () => {
    await registerAndPlay()
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')

    await GamePage.playCell(4)
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x')
    await expect(GamePage.cell(4)).toBeDisabled()

    const oCells: number[] = []
    for (let i = 0; i < 9; i++) {
      if ((await GamePage.cellState(i)) === 'o') oCells.push(i)
    }
    const status = await GamePage.statusValue()
    if (!['human', 'computer', 'draw'].includes(status || '')) {
      await expect(oCells.length).toBe(1)
      await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')
    }
  })

  it('[GAME-002] New Game and Reset clear the board', async () => {
    await registerAndPlay()
    await GamePage.playCell(0)
    await GamePage.newGame()
    await GamePage.expectEmptyBoard()
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')

    await GamePage.playCell(1)
    await GamePage.reset()
    await GamePage.expectEmptyBoard()
  })

  it('[GAME-003] Hint highlights a suggested empty cell', async () => {
    await registerAndPlay()
    await GamePage.hint()
    await browser.waitUntil(async () => (await GamePage.hintedCellCount()) >= 1, {
      timeout: 3000,
      timeoutMsg: 'Expected a hinted cell',
    })
    await expect(await GamePage.hintedCellCount()).toBeGreaterThanOrEqual(1)
  })

  it('[GAME-004] finishing a game updates status, history, and profile counters', async () => {
    await registerAndPlay()
    await GamePage.setEasy()

    let result: string | null = null
    for (let attempt = 0; attempt < 6; attempt++) {
      await GamePage.newGame()
      result = await GamePage.playUntilOver()
      if (result === 'human' || result === 'computer' || result === 'draw') break
    }
    expect(['human', 'computer', 'draw']).toContain(result)

    await HeaderPage.goHistory()
    await HistoryPage.waitForDisplayed()
    await expect(HistoryPage.empty).not.toBeDisplayed()
    await expect(await HistoryPage.rowCount()).toBeGreaterThanOrEqual(1)

    await HeaderPage.goProfile()
    await ProfilePage.waitForDisplayed()
    const wins = Number(await ProfilePage.wins.getText())
    const losses = Number(await ProfilePage.losses.getText())
    const draws = Number(await ProfilePage.draws.getText())
    expect(wins + losses + draws).toBeGreaterThanOrEqual(1)
  })

  it('[GAME-005] initial board is empty on your turn', async () => {
    await registerAndPlay()
    await expect(await GamePage.cellCount()).toBe(9)
    await GamePage.expectEmptyBoard()
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')
  })

  it('[GAME-006] shows computer-thinking after a human move', async () => {
    await registerAndPlay()
    await GamePage.clickCellRaw(4)
    await GamePage.waitForStatus('computer-thinking', 3000)
    await expect(GamePage.status).toHaveAttribute(
      'data-status',
      'computer-thinking',
    )
  })

  it('[GAME-008] empty cells are disabled while computer is thinking', async () => {
    await registerAndPlay()
    await GamePage.clickCellRaw(4)
    await GamePage.waitForStatus('computer-thinking', 3000)
    await expect(await GamePage.emptyCellsDisabled()).toBe(true)
  })

  it('[GAME-009] all cells are disabled after game over', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('human')
    await expect(await GamePage.allCellsDisabled()).toBe(true)
  })

  it('[GAME-010] human win sets status and copy', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('human')
    await expect(GamePage.status).toHaveAttribute('data-status', 'human')
    await expect(GamePage.status).toHaveText('You win!')
  })

  it('[GAME-011] winning cells are highlighted', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('human')
    await expect(await GamePage.winCellCount()).toBe(3)
  })

  it('[GAME-012] computer win sets status and copy', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('computer')
    await expect(GamePage.status).toHaveAttribute('data-status', 'computer')
    await expect(GamePage.status).toHaveText('Computer wins.')
  })

  it('[GAME-013] draw sets status and copy', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('draw', 50)
    await expect(GamePage.status).toHaveAttribute('data-status', 'draw')
    await expect(GamePage.status).toHaveText('Draw.')
    await expect(await GamePage.winCellCount()).toBe(0)
  })

  it('[GAME-014] human win highlights a valid row/column/diagonal', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('human')
    const line = await GamePage.waitForWinHighlight()
    await expect(line).toHaveLength(3)
    expect(GamePage.isWinningLine(line)).toBe(true)
  })

  it('[GAME-015] New Game after finished allows another move', async () => {
    await registerAndPlay()
    await GamePage.playUntilResult('human')
    await GamePage.newGame()
    await GamePage.expectEmptyBoard()
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')
    await GamePage.playCell(4)
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x')
  })

  it('[GAME-016] Hint mid-game marks a legal empty cell', async () => {
    await registerAndPlay()
    await GamePage.playCell(0)
    await GamePage.hint()
    await browser.waitUntil(async () => (await GamePage.hintedCellCount()) >= 1, {
      timeout: 3000,
      timeoutMsg: 'Expected a mid-game hint',
    })
    const hinted = await browser.execute(() => {
      const el = document.querySelector('.cell.is-hint') as HTMLElement | null
      return {
        state: el?.getAttribute('data-state'),
        id: el?.getAttribute('data-testid'),
      }
    })
    expect(hinted.state).toBe('empty')
    expect(hinted.id).toMatch(/^cell-[0-8]$/)
  })

  it('[GAME-017] Hint is disabled while computer thinks and after game over', async () => {
    await registerAndPlay()
    await GamePage.clickCellRaw(4)
    await GamePage.waitForStatus('computer-thinking', 3000)
    await expect(GamePage.hintBtn).toBeDisabled()

    await GamePage.waitForStatus(
      ['your-turn', 'human', 'computer', 'draw'],
      10000,
    )
    if ((await GamePage.statusValue()) === 'your-turn') {
      await GamePage.playUntilResult('human')
    }
    await expect(GamePage.hintBtn).toBeDisabled()
  })

  it('[GAME-018] Hint highlight fades after timeout', async () => {
    await registerAndPlay()
    await GamePage.hint()
    await browser.waitUntil(async () => (await GamePage.hintedCellCount()) >= 1, {
      timeout: 3000,
      timeoutMsg: 'Expected hint to appear',
    })
    await browser.waitUntil(async () => (await GamePage.hintedCellCount()) === 0, {
      timeout: 5000,
      timeoutMsg: 'Expected hint to fade',
    })
  })

  it('[GAME-019] double-clicking an empty cell places only one X', async () => {
    await registerAndPlay()
    await browser.execute(() => {
      const cell = document.querySelector(
        '[data-testid="cell-4"]',
      ) as HTMLElement
      cell.click()
      cell.click()
    })
    await GamePage.waitForStatus(
      ['your-turn', 'human', 'computer', 'draw'],
      10000,
    )
    await expect(await GamePage.countState('x')).toBe(1)
    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x')
  })

  it('[GAME-020] status copy matches data-status', async () => {
    await registerAndPlay()
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')
    await expect(GamePage.status).toHaveText(
      GamePage.statusCopyPattern('your-turn') as RegExp,
    )

    for (const outcome of ['human', 'computer', 'draw'] as const) {
      await GamePage.playUntilResult(outcome, outcome === 'draw' ? 50 : 30)
      await expect(GamePage.status).toHaveAttribute('data-status', outcome)
      await expect(GamePage.status).toHaveText(
        GamePage.statusCopyPattern(outcome) as RegExp,
      )
    }
  })

  it('[GAME-021] board exposes cells 0–8 only', async () => {
    await registerAndPlay()
    await expect(await GamePage.cellCount()).toBe(9)
    for (let i = 0; i < 9; i++) {
      await expect(GamePage.cell(i)).toBeExisting()
    }
    await expect($('[data-testid="cell-9"]')).not.toBeExisting()
  })

  it('[DIFF-002] defaults difficulty to Easy for a new user', async () => {
    await registerAndPlay()
    await expect(GamePage.difficulty).toHaveValue('easy')
  })

  it('[DIFF-003] changes difficulty on idle board without confirm', async () => {
    await registerAndPlay()
    await expect(GamePage.difficulty).toHaveValue('easy')

    await browser.execute(() => {
      ;(window as unknown as { __c: string | null }).__c = null
      const orig = window.confirm
      window.confirm = (m?: string) => {
        ;(window as unknown as { __c: string | null }).__c = String(m ?? '')
        return true
      }
      ;(window as unknown as { __orig: typeof confirm }).__orig = orig
    })
    await GamePage.difficulty.selectByAttribute('value', 'medium')
    const confirmCalled = await browser.execute(
      () => (window as unknown as { __c: string | null }).__c,
    )
    expect(confirmCalled).toBeNull()
    await expect(GamePage.difficulty).toHaveValue('medium')
    await GamePage.expectEmptyBoard()
  })

  it('[DIFF-001] changing difficulty mid-game with confirm starts a fresh board', async () => {
    await registerAndPlay()
    await GamePage.setEasy()
    await GamePage.newGame()
    await GamePage.playCell(4)
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')

    await GamePage.difficulty.selectByAttribute('value', 'hard')
    await browser.waitUntil(
      async () => {
        try {
          const text = await browser.getAlertText()
          if (text !== 'Change difficulty and start a new game?') return false
          await browser.acceptAlert()
          return true
        } catch {
          return false
        }
      },
      {
        timeout: 5000,
        timeoutMsg:
          'Expected confirm: “Change difficulty and start a new game?”',
      },
    )

    await GamePage.waitUntilYourTurn()
    await GamePage.expectEmptyBoard()
    await expect(GamePage.difficulty).toHaveValue('hard')
  })

  it('[DIFF-004] dismissing difficulty confirm keeps board and difficulty', async () => {
    await registerAndPlay()
    await GamePage.setEasy()
    await GamePage.newGame()
    await GamePage.playCell(4)
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')

    // Stub Cancel + capture copy (native dismissAlert is flaky in Chrome)
    await browser.execute(() => {
      ;(
        window as unknown as { __lastConfirm: string | null; confirm: (m?: string) => boolean }
      ).__lastConfirm = null
      ;(window as unknown as { confirm: (m?: string) => boolean }).confirm = (
        msg?: string,
      ) => {
        ;(
          window as unknown as { __lastConfirm: string | null }
        ).__lastConfirm = String(msg ?? '')
        return false
      }
    })
    await GamePage.difficulty.selectByAttribute('value', 'hard')
    const confirmText = await browser.execute(
      () =>
        (window as unknown as { __lastConfirm: string | null }).__lastConfirm,
    )
    expect(confirmText).toBe('Change difficulty and start a new game?')

    await expect(GamePage.cell(4)).toHaveAttribute('data-state', 'x')
    await expect(GamePage.status).toHaveAttribute('data-status', 'your-turn')
    await expect(GamePage.difficulty).toHaveValue('easy')
  })

  it('[DIFF-006] difficulty is saved on the user across logout/login', async () => {
    const name = uniqueName('DiffPersist')
    await openFreshApp()
    await AuthPage.register(name)
    await GamePage.waitForDisplayed()

    await GamePage.difficulty.selectByAttribute('value', 'hard')
    await expect(GamePage.difficulty).toHaveValue('hard')

    await HeaderPage.logout()
    await AuthPage.switchMode()
    await AuthPage.login(name)
    await GamePage.waitForDisplayed()
    await expect(GamePage.difficulty).toHaveValue('hard')
  })
})
