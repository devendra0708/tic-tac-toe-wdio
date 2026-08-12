class ProfilePage {
  get view() {
    return $('[data-testid="view-profile"]')
  }
  get title() {
    return $('[data-testid="profile-title"]')
  }
  get nameInput() {
    return $('[data-testid="input-profile-name"]')
  }
  get saveBtn() {
    return $('[data-testid="btn-save-profile"]')
  }
  get error() {
    return $('[data-testid="profile-error"]')
  }
  get message() {
    return $('[data-testid="profile-message"]')
  }
  get wins() {
    return $('[data-testid="profile-wins"]')
  }
  get losses() {
    return $('[data-testid="profile-losses"]')
  }
  get draws() {
    return $('[data-testid="profile-draws"]')
  }
  get created() {
    return $('[data-testid="profile-created"]')
  }
  get deleteBtn() {
    return $('[data-testid="btn-delete-account"]')
  }

  async waitForDisplayed() {
    await this.view.waitForDisplayed()
  }

  async saveName(name: string) {
    await this.nameInput.setValue(name)
    await this.saveBtn.click()
  }

  async deleteAccount(accept = true) {
    await this.deleteBtn.waitForClickable()
    await this.deleteBtn.click()
    await browser.waitUntil(
      async () => {
        try {
          await browser.getAlertText()
          return true
        } catch {
          return false
        }
      },
      { timeout: 5000, timeoutMsg: 'Expected delete confirm dialog' },
    )
    if (accept) {
      await browser.acceptAlert()
    } else {
      await browser.dismissAlert()
    }
  }
}

export default new ProfilePage()
