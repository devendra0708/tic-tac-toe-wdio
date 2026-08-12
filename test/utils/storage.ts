/** Clear SUT localStorage and open a fresh app instance. */
export async function openFreshApp(): Promise<void> {
  await browser.url('/index.html')
  await browser.execute(() => localStorage.clear())
  await browser.url('/index.html')
  await $('[data-testid="app"]').waitForExist()
}

export function uniqueName(prefix = 'User'): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
}
