class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.country = page.locator("[placeholder*='Country']");
    this.dropdown = page.locator(".ta-results");
    this.optionsCount = this.dropdown.locator("button");
    this.username = page.locator(".user__name [type='text']");
    this.submitButton = page.locator(".action__submit");
  }
  async selectCountry(countryName) {
    await this.country.type(countryName, { delay: 100 });
    await this.dropdown.waitFor();
    for (let i = 0; i < (await this.optionsCount.count()); ++i) {
      const text = await this.optionsCount.nth(i).textContent();
      if (text === " " + countryName) {
        await this.optionsCount.nth(i).click();
        break;
      }
    }
  }
  async getUsername() {
    const userName = await this.username.first().textContent();
    return userName;
  }
  async submit() {
    await this.submitButton.click();
  }
}
module.exports = { CheckoutPage };
