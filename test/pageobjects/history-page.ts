class HistoryPage {
  get view() {
    return $('[data-testid="view-history"]')
  }
  get title() {
    return $('[data-testid="history-title"]')
  }
  get empty() {
    return $('[data-testid="history-empty"]')
  }
  get table() {
    return $('[data-testid="history-table"]')
  }
  get clearBtn() {
    return $('[data-testid="btn-clear-history"]')
  }
  get rows() {
    return $$('[data-testid^="history-row-"]')
  }

  async waitForDisplayed() {
    await this.view.waitForDisplayed()
  }

  async rowCount(): Promise<number> {
    return this.rows.length
  }

  row(index: number) {
    return $(`[data-testid="history-row-${index}"]`)
  }

  date(index: number) {
    return $(`[data-testid="history-date-${index}"]`)
  }

  result(index: number) {
    return $(`[data-testid="history-result-${index}"]`)
  }

  difficulty(index: number) {
    return $(`[data-testid="history-difficulty-${index}"]`)
  }

  async rowResultAttr(index: number) {
    return this.row(index).getAttribute('data-result')
  }

  async clear(accept = true) {
    await this.clearBtn.waitForClickable()
    await this.clearBtn.click()
    await browser.waitUntil(
      async () => {
        try {
          await browser.getAlertText()
          return true
        } catch {
          return false
        }
      },
      { timeout: 5000, timeoutMsg: 'Expected clear-history confirm' },
    )
    if (accept) {
      await browser.acceptAlert()
    } else {
      await browser.dismissAlert()
    }
  }
}

export default new HistoryPage()
