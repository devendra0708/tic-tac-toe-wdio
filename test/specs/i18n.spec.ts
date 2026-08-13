import AuthPage from '../pageobjects/auth-page'
import GamePage from '../pageobjects/game-page'
import HeaderPage from '../pageobjects/header-page'
import ProfilePage from '../pageobjects/profile-page'
import { openFreshApp, uniqueName } from '../utils/storage'

describe('i18n', () => {
  beforeEach(async () => {
    await openFreshApp()
  })

  it('[I18N-001] defaults to English (LTR)', async () => {
    await AuthPage.waitForDisplayed()
    await expect(await HeaderPage.lang()).toBe('en')
    await expect(await HeaderPage.dir()).toBe('ltr')
    await expect(AuthPage.registerBtn).toHaveText('Create Account')
  })

  it('[I18N-002] switches to Persian with RTL and translated nav', async () => {
    await AuthPage.register(uniqueName('I18n2'))
    await GamePage.waitForDisplayed()

    await HeaderPage.setLanguage('fa')
    await expect(await HeaderPage.lang()).toBe('fa')
    await expect(await HeaderPage.dir()).toBe('rtl')
    await expect(HeaderPage.navPlay).toHaveText('بازی')
    await expect(HeaderPage.navProfile).toHaveText('پروفایل')
    await expect(HeaderPage.navHistory).toHaveText('تاریخچه')
    await expect(HeaderPage.logoutBtn).toHaveText('خروج')
  })

  it('[I18N-003] translates auth screen to Persian', async () => {
    await AuthPage.waitForDisplayed()
    await HeaderPage.setLanguage('fa')

    await expect(await HeaderPage.lang()).toBe('fa')
    await expect(await HeaderPage.dir()).toBe('rtl')
    await expect(AuthPage.registerBtn).toHaveText('ساخت حساب')
    await expect(AuthPage.switchModeBtn).toHaveText('حساب دارید؟ وارد شوید')

    await AuthPage.submitEmptyRegister()
    await expect(AuthPage.error).toHaveText('لطفاً یک نام وارد کنید.')
  })

  it('[I18N-004] translates game status and controls to Persian', async () => {
    await HeaderPage.setLanguage('fa')
    await AuthPage.register(uniqueName('I18n4'))
    await GamePage.waitForDisplayed()

    await expect(GamePage.status).toHaveText('نوبت شما (X)')
    await expect(await GamePage.statusValue()).toBe('your-turn')
    await expect(GamePage.newGameBtn).toHaveText('بازی جدید')
    await expect(GamePage.hintBtn).toHaveText('راهنمایی')
    await expect(GamePage.resetBtn).toHaveText('بازنشانی')
  })

  it('[I18N-005] switches back to English (LTR)', async () => {
    await AuthPage.register(uniqueName('I18n5'))
    await GamePage.waitForDisplayed()

    await HeaderPage.setLanguage('fa')
    await expect(HeaderPage.navPlay).toHaveText('بازی')

    await HeaderPage.setLanguage('en')
    await expect(await HeaderPage.lang()).toBe('en')
    await expect(await HeaderPage.dir()).toBe('ltr')
    await expect(HeaderPage.navPlay).toHaveText('Play')
    await expect(GamePage.status).toHaveText('Your turn (X)')
  })

  it('[I18N-006] language persists after reload', async () => {
    await AuthPage.register(uniqueName('I18n6'))
    await GamePage.waitForDisplayed()

    await HeaderPage.setLanguage('fa')
    await browser.refresh()
    await GamePage.waitForDisplayed()

    await expect(await HeaderPage.lang()).toBe('fa')
    await expect(await HeaderPage.dir()).toBe('rtl')
    await expect(HeaderPage.navPlay).toHaveText('بازی')
  })

  it('[I18N-007] language can be changed on auth screen before register', async () => {
    await AuthPage.waitForDisplayed()
    await HeaderPage.setLanguage('fa')
    await expect(AuthPage.registerBtn).toHaveText('ساخت حساب')

    const name = uniqueName('I18n7')
    await AuthPage.register(name)
    await GamePage.waitForDisplayed()

    await expect(await HeaderPage.dir()).toBe('rtl')
    await expect(HeaderPage.navPlay).toHaveText('بازی')
    await expect(HeaderPage.hello).toHaveText(new RegExp(`سلام، ${name}`))
  })

  it('[I18N-013] Profile created date uses Persian calendar format', async () => {
    await AuthPage.register(uniqueName('I18n13'))
    await GamePage.waitForDisplayed()
    await HeaderPage.setLanguage('fa')
    await HeaderPage.goProfile()
    await ProfilePage.waitForDisplayed()

    const created = (await ProfilePage.created.getText()).trim()
    // e.g. ۱۴۰۵/۵/۲۱ (Persian digits + fa-IR calendar)
    expect(created).toMatch(/^[۰-۹]{4}\/[۰-۹]{1,2}\/[۰-۹]{1,2}/)
  })

  it('[I18N-014] Difficulty options translate to آسان / متوسط / سخت', async () => {
    await HeaderPage.setLanguage('fa')
    await AuthPage.register(uniqueName('I18n14'))
    await GamePage.waitForDisplayed()

    const options = await GamePage.difficultyOptionLabels()
    const byValue = Object.fromEntries(options.map((o) => [o.value, o.text]))
    expect(byValue.easy).toBe('آسان')
    expect(byValue.medium).toBe('متوسط')
    expect(byValue.hard).toBe('سخت')
  })
})
