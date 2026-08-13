import BasePage from './base-page'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

const STATUS_COPY: Record<string, RegExp> = {
  'your-turn': /your turn \(x\)/i,
  human: /you win/i,
  computer: /computer wins/i,
  draw: /^draw\./i,
}

class GamePage extends BasePage {
  get view() {
    return this.tid('view-play')
  }
  get status() {
    return this.tid('status')
  }
  get board() {
    return this.tid('board')
  }
  get difficulty() {
    return this.tid('select-difficulty')
  }
  get newGameBtn() {
    return this.tid('btn-new')
  }
  get hintBtn() {
    return this.tid('btn-hint')
  }
  get resetBtn() {
    return this.tid('btn-reset')
  }

  cell(index: number) {
    return this.tid(`cell-${index}`)
  }

  async waitForDisplayed() {
    await this.waitFor(this.view)
  }

  async statusValue(): Promise<string | null> {
    return this.status.getAttribute('data-status')
  }

  async cellState(index: number): Promise<string | null> {
    return this.cell(index).getAttribute('data-state')
  }

  async cellCount(): Promise<number> {
    return this.tidPrefix('cell-').length
  }

  async waitUntilYourTurn(timeout = 10000) {
    await browser.waitUntil(
      async () => (await this.statusValue()) === 'your-turn',
      { timeout, timeoutMsg: 'Expected status your-turn' },
    )
  }

  async waitForStatus(
    statuses: string | string[],
    timeout = 10000,
  ): Promise<string | null> {
    const wanted = Array.isArray(statuses) ? statuses : [statuses]
    await browser.waitUntil(
      async () => wanted.includes((await this.statusValue()) || ''),
      {
        timeout,
        timeoutMsg: `Expected status in [${wanted.join(', ')}]`,
      },
    )
    return this.statusValue()
  }

  async playCell(index: number) {
    await this.cell(index).waitForEnabled()
    await this.cell(index).click()
    await browser.waitUntil(
      async () => {
        const s = await this.statusValue()
        return (
          s === 'your-turn' ||
          s === 'human' ||
          s === 'computer' ||
          s === 'draw'
        )
      },
      { timeout: 10000, timeoutMsg: 'Board did not settle after move' },
    )
  }

  /** Click without waiting for the computer reply to finish. */
  async clickCellRaw(index: number) {
    await this.cell(index).waitForEnabled()
    await this.cell(index).click()
  }

  async newGame() {
    await this.newGameBtn.click()
    await this.waitUntilYourTurn()
  }

  async reset() {
    await this.resetBtn.click()
    await this.waitUntilYourTurn()
  }

  async hint() {
    await this.hintBtn.click()
  }

  async hintedCellCount(): Promise<number> {
    return $$('.cell.is-hint').length
  }

  async winCellCount(): Promise<number> {
    return $$('.cell.is-win').length
  }

  async winCellIndices(): Promise<number[]> {
    return browser.execute(() =>
      [...document.querySelectorAll('.cell.is-win')].map((el) =>
        Number(el.getAttribute('data-testid')!.replace('cell-', '')),
      ),
    )
  }

  async states(): Promise<Array<string | null>> {
    const out: Array<string | null> = []
    for (let i = 0; i < 9; i++) out.push(await this.cellState(i))
    return out
  }

  async countState(state: string): Promise<number> {
    return (await this.states()).filter((s) => s === state).length
  }

  async allCellsDisabled(): Promise<boolean> {
    for (let i = 0; i < 9; i++) {
      if (await this.cell(i).isEnabled()) return false
    }
    return true
  }

  async emptyCellsDisabled(): Promise<boolean> {
    for (let i = 0; i < 9; i++) {
      if ((await this.cellState(i)) !== 'empty') continue
      if (await this.cell(i).isEnabled()) return false
    }
    return true
  }

  async expectEmptyBoard() {
    for (let i = 0; i < 9; i++) {
      await expect(this.cell(i)).toHaveAttribute('data-state', 'empty')
    }
  }

  async setEasy() {
    await this.difficulty.selectByAttribute('value', 'easy')
  }

  /**
   * Change difficulty with a stubbed confirm (native alerts race in headless Chrome).
   * @returns confirm message when a confirm fired; otherwise null
   */
  async changeDifficulty(
    value: 'easy' | 'medium' | 'hard',
    acceptConfirm = true,
  ): Promise<string | null> {
    await this.stubConfirm(acceptConfirm)
    await this.difficulty.selectByAttribute('value', value)
    return this.lastStubbedConfirm()
  }

  async difficultyOptionLabels(): Promise<
    Array<{ value: string; text: string }>
  > {
    return browser.execute(() =>
      [
        ...document.querySelectorAll('[data-testid="select-difficulty"] option'),
      ].map((el) => ({
        value: (el as HTMLOptionElement).value,
        text: (el.textContent || '').trim(),
      })),
    )
  }

  async playUntilOver(maxMoves = 9, order = [0, 2, 1, 3, 6, 4, 5, 7, 8]) {
    for (let i = 0; i < maxMoves; i++) {
      const status = await this.statusValue()
      if (status === 'human' || status === 'computer' || status === 'draw') {
        return status
      }
      for (const idx of order) {
        if (await this.cell(idx).isEnabled()) {
          await this.playCell(idx)
          break
        }
      }
    }
    return this.statusValue()
  }

  async playUntilResult(
    wanted: 'human' | 'computer' | 'draw',
    maxAttempts = 30,
  ): Promise<string> {
    await this.setEasy()
    const orders =
      wanted === 'draw'
        ? [
            [0, 1, 2, 3, 4, 5, 6, 7, 8],
            [0, 2, 1, 3, 6, 4, 5, 7, 8],
            [4, 0, 8, 2, 6, 1, 3, 5, 7],
            [0, 8, 2, 6, 1, 3, 5, 7, 4],
            [1, 3, 5, 7, 0, 2, 6, 8, 4],
          ]
        : [[0, 2, 1, 3, 6, 4, 5, 7, 8]]

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.newGame()
      const order = orders[attempt % orders.length]
      const result = await this.playUntilOver(9, order)
      if (result === wanted) return result
    }
    throw new Error(`Did not reach status "${wanted}" in ${maxAttempts} games`)
  }

  async waitForWinHighlight(timeout = 5000): Promise<number[]> {
    await browser.waitUntil(async () => (await this.winCellCount()) === 3, {
      timeout,
      timeoutMsg: 'Expected 3 winning cells highlighted',
    })
    return this.winCellIndices()
  }

  isWinningLine(indices: number[]): boolean {
    const sorted = [...indices].sort((a, b) => a - b).join(',')
    return WIN_LINES.some((line) => line.join(',') === sorted)
  }

  statusCopyPattern(status: string): RegExp | undefined {
    return STATUS_COPY[status]
  }
}

export default new GamePage()
