/**
 * Shared helpers for page objects (testid locators, waits, native confirms).
 */
export default class BasePage {
  /** Single element by `data-testid`. */
  protected tid(id: string) {
    return $(`[data-testid="${id}"]`)
  }

  /** Elements whose `data-testid` starts with `prefix`. */
  protected tidPrefix(prefix: string) {
    return $$(`[data-testid^="${prefix}"]`)
  }

  protected async waitFor(
    el: ChainablePromiseElement,
    options?: Parameters<ChainablePromiseElement['waitForDisplayed']>[0],
  ) {
    await el.waitForDisplayed(options)
  }

  protected async waitForNativeConfirm(
    timeoutMsg: string,
    timeout = 5000,
  ): Promise<string> {
    let text = ''
    await browser.waitUntil(
      async () => {
        try {
          text = await browser.getAlertText()
          return true
        } catch {
          return false
        }
      },
      { timeout, timeoutMsg },
    )
    return text
  }

  protected async acceptNativeConfirm(timeoutMsg: string) {
    await this.waitForNativeConfirm(timeoutMsg)
    await browser.acceptAlert()
  }

  protected async dismissNativeConfirm(timeoutMsg: string) {
    await this.waitForNativeConfirm(timeoutMsg)
    await browser.dismissAlert()
  }

  /** Replace `window.confirm` and record the last message as `__lastConfirm`. */
  protected async stubConfirm(accept: boolean) {
    await browser.execute((shouldAccept) => {
      ;(
        window as unknown as { __lastConfirm: string | null }
      ).__lastConfirm = null
      window.confirm = (msg?: string) => {
        ;(
          window as unknown as { __lastConfirm: string | null }
        ).__lastConfirm = String(msg ?? '')
        return shouldAccept
      }
    }, accept)
  }

  protected async lastStubbedConfirm(): Promise<string | null> {
    return browser.execute(
      () =>
        (window as unknown as { __lastConfirm: string | null }).__lastConfirm,
    )
  }
}
