import BasePage from './base-page'

class HeaderPage extends BasePage {
  get themeBtn() {
    return this.tid('btn-theme')
  }
  get languageSelect() {
    return this.tid('select-language')
  }
  get hello() {
    return this.tid('hello-user')
  }
  get navPlay() {
    return this.tid('nav-play')
  }
  get navProfile() {
    return this.tid('nav-profile')
  }
  get navHistory() {
    return this.tid('nav-history')
  }
  get logoutBtn() {
    return this.tid('btn-logout')
  }

  async theme(): Promise<string | null> {
    return $('html').getAttribute('data-theme')
  }

  async lang(): Promise<string | null> {
    return $('html').getAttribute('lang')
  }

  async dir(): Promise<string | null> {
    return $('html').getAttribute('dir')
  }

  async toggleTheme() {
    await this.themeBtn.click()
  }

  async setLanguage(code: 'en' | 'fa') {
    await this.languageSelect.selectByAttribute('value', code)
  }

  async logout() {
    await this.logoutBtn.click()
  }

  async goPlay() {
    await this.navPlay.click()
  }

  async goProfile() {
    await this.navProfile.click()
  }

  async goHistory() {
    await this.navHistory.click()
  }
}

export default new HeaderPage()
