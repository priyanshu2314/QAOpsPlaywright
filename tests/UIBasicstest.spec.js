const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({ browser }) => {
  //chrome- plugins/ cookies
  const context = await browser.newContext();
  const page = await context.newPage();
  //page.route("**/*.{jpg,png,jpeg}", (route) => route.abort());
  page.on("request", (request) => console.log(request.url()));
  page.on("response", (response) =>
    console.log(response.url(), response.status()),
  );
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  await userName.fill("rahulshettyacademy");
  await page.locator("[type='password']").fill("Learning@830$3mK2");
  await signIn.click();
  //console.log(await page.locator("[style*='block']").textContent());
  //await expect(page.locator("[style*='block']")).toContainText("Incorrect");

  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  await signIn.click();
  console.log(await cardTitles.first().textContent());
  console.log(await cardTitles.nth(1).textContent());
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test("Page Playwright test", async ({ page }) => {
  await page.goto("https://google.com");
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test("Practice", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("priyanshujha@gmail.com");
  await page.locator("[type='password']").fill("Prj2314@");
  await page.locator("#login").click();
  console.log(await page.locator(".card-body b").first());
});

test("UI Controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();
  console.log(await page.locator(".radiotextsty").last().isChecked());
  await expect(page.locator(".radiotextsty").last()).toBeChecked();
  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();
  await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test("Child Windows Handle", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test("Client App login", async ({ page }) => {
  const email = "priyanshujha@gmail.com";
  const productName = "ZARA COAT 3";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("priyanshujha@gmail.com");
  await page.locator("[type='password']").fill("Prj2314@");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
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
