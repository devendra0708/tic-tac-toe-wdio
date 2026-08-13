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

  async clear(accept = true) {
    await this.clearBtn.waitForClickable()
    await this.clearBtn.click()
    if (accept) {
      await this.acceptNativeConfirm('Expected clear-history confirm')
    } else {
      await this.dismissNativeConfirm('Expected clear-history confirm')
    }
  }
}

export default new HistoryPage()
