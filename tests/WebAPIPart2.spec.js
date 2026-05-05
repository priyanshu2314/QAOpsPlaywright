const { test, expect } = require("@playwright/test");
let webContext;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("priyanshujha@gmail.com");
  await page.locator("[type='password']").fill("Prj2314@");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});
test("@API Client App login", async () => {
  const email = "priyanshujha@gmail.com";
  const productName = "ZARA COAT 3";
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  const products = page.locator(".card-body");

  await page.locator(".card-body b").first().waitFor();
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    if ((await products.nth(i).locator("b").textContent()) == productName) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();
  await page.locator("[placeholder*='Country']").pressSequentially("ind");
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    email,
  );
  await page.locator(".action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. ",
  );
  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
  await page.locator("[routerlink*='myorders']").first().click();
  await page.locator(".table [scope='row']").first().waitFor();
  const rows = page.locator("tbody tr");
  let flag = 0;
  for (let i = 0; i < (await rows.count()); i++) {
    if (orderId.includes(await rows.nth(i).locator("th").textContent())) {
      console.log("Order found");
      await rows.nth(i).locator(".btn-primary").click();
      flag = 1;
      break;
    }
  }
  if (flag == 0) {
    console.log("Order not found");
  }
  const orderIdDetails = await page.locator(".-main").textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
  //await page.pause();
});
test("Test case 2", async () => {
  const email = "priyanshujha@gmail.com";
  const productName = "ZARA COAT 3";
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  const products = page.locator(".card-body");

  await page.locator(".card-body b").first().waitFor();
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
});
