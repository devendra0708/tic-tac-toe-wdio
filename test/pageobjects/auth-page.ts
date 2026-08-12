class AuthPage {
  get form() {
    return $('[data-testid="auth-form"]')
  }
  get nameInput() {
    return $('[data-testid="input-name"]')
  }
  get error() {
    return $('[data-testid="auth-error"]')
  }
  get registerBtn() {
    return $('[data-testid="btn-register"]')
  }
  get loginBtn() {
    return $('[data-testid="btn-login"]')
  }
  get switchModeBtn() {
    return $('[data-testid="btn-switch-mode"]')
  }

  async waitForDisplayed() {
    await this.form.waitForDisplayed()
  }

  async register(name: string) {
    await this.nameInput.setValue(name)
    await this.registerBtn.click()
  }

  async login(name: string) {
    await this.nameInput.setValue(name)
    await this.loginBtn.click()
  }

  async switchMode() {
    await this.switchModeBtn.click()
  }

  async submitEmptyRegister() {
    await this.nameInput.clearValue()
    await this.registerBtn.click()
  }
}

export default new AuthPage()
