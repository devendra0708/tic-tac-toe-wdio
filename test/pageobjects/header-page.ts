class HeaderPage {
  get themeBtn() {
    return $('[data-testid="btn-theme"]')
  }
  get languageSelect() {
    return $('[data-testid="select-language"]')
  }
  get hello() {
    return $('[data-testid="hello-user"]')
  }
  get navPlay() {
    return $('[data-testid="nav-play"]')
  }
  get navProfile() {
    return $('[data-testid="nav-profile"]')
  }
  get navHistory() {
    return $('[data-testid="nav-history"]')
  }
  get logoutBtn() {
    return $('[data-testid="btn-logout"]')
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
