import BasePage from './base-page'

class ProfilePage extends BasePage {
  get view() {
    return this.tid('view-profile')
  }
  get title() {
    return this.tid('profile-title')
  }
  get nameInput() {
    return this.tid('input-profile-name')
  }
  get saveBtn() {
    return this.tid('btn-save-profile')
  }
  get error() {
    return this.tid('profile-error')
  }
  get message() {
    return this.tid('profile-message')
  }
  get wins() {
    return this.tid('profile-wins')
  }
  get losses() {
    return this.tid('profile-losses')
  }
  get draws() {
    return this.tid('profile-draws')
  }
  get created() {
    return this.tid('profile-created')
  }
  get deleteBtn() {
    return this.tid('btn-delete-account')
  }

  async waitForDisplayed() {
    await this.waitFor(this.view)
  }

  async saveName(name: string) {
    await this.nameInput.setValue(name)
    await this.saveBtn.click()
  }

  async deleteAccount(accept = true) {
    await this.deleteBtn.waitForClickable()
    await this.deleteBtn.click()
    if (accept) {
      await this.acceptNativeConfirm('Expected delete confirm dialog')
    } else {
      await this.dismissNativeConfirm('Expected delete confirm dialog')
    }
  }
}

export default new ProfilePage()
