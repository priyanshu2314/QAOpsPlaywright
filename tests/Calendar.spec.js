const { test, expect } = require("@playwright/test");

test("@Web Calendar validations", async ({ page }) => {
  //Calendar status in priyanshu_fixes branch
  const monthNumber = "6";
  const date = "15";
  const year = "2027";
  const expectedList = [monthNumber, date, year];
  await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
  await page.locator(".react-date-picker__inputGroup").click();
  await page.locator(".react-calendar__navigation__label__labelText").click();
  await page.locator(".react-calendar__navigation__label__labelText").click();
  await page.getByText(year).click();
  await page
    .locator(".react-calendar__tile ")
    .nth(monthNumber - 1)
    .click();
  await page.locator("//abbr[text()='" + date + "']").click();
  const inputs = page.locator(".react-date-picker__inputGroup__input");
  for (let i = 0; i < expectedList.length; i++) {
    const value = await inputs.nth(i).inputValue();
    expect(value).toEqual(expectedList[i]);
  }
});
