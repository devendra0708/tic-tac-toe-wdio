import BasePage from './base-page'

class HistoryPage extends BasePage {
  get view() {
    return this.tid('view-history')
  }
  get title() {
    return this.tid('history-title')
  }
  get empty() {
    return this.tid('history-empty')
  }
  get table() {
    return this.tid('history-table')
  }
  get clearBtn() {
    return this.tid('btn-clear-history')
  }
  get rows() {
    return this.tidPrefix('history-row-')
  }

  async waitForDisplayed() {
    await this.waitFor(this.view)
  }

  async rowCount(): Promise<number> {
    return this.rows.length
  }

  row(index: number) {
    return this.tid(`history-row-${index}`)
  }

  date(index: number) {
    return this.tid(`history-date-${index}`)
  }

  result(index: number) {
    return this.tid(`history-result-${index}`)
  }

  difficulty(index: number) {
    return this.tid(`history-difficulty-${index}`)
  }

  async rowResultAttr(index: number) {
    return this.row(index).getAttribute('data-result')
  }

  /**
   * Clear history via stubbed confirm (native alerts race in headless Chrome).
   * @returns confirm message captured by the stub
   */
  async clear(accept = true): Promise<string | null> {
    await this.stubConfirm(accept)
    await this.clearBtn.waitForClickable()
    await this.clearBtn.click()
    return this.lastStubbedConfirm()
  }
}

export default new HistoryPage()
