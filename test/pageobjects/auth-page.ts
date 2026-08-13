import BasePage from './base-page';

class AuthPage extends BasePage {
  get form() {
    return this.tid('auth-form');
  }
  get nameInput() {
    return this.tid('input-name');
  }
  get error() {
    return this.tid('auth-error');
  }
  get registerBtn() {
    return this.tid('btn-register');
  }
  get loginBtn() {
    return this.tid('btn-login');
  }
  get switchModeBtn() {
    return this.tid('btn-switch-mode');
  }

  async waitForDisplayed() {
    await this.waitFor(this.form);
  }

  async register(name: string) {
    await this.nameInput.setValue(name);
    await this.registerBtn.click();
  }

  async login(name: string) {
    await this.nameInput.setValue(name);
    await this.loginBtn.click();
  }

  async switchMode() {
    await this.switchModeBtn.click();
  }

  async submitEmptyRegister() {
    await this.nameInput.clearValue();
    await this.registerBtn.click();
  }
}

export default new AuthPage();
