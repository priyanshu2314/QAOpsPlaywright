const { test, expect } = require("@playwright/test");

test("Security test request intercept", async ({ page }) => {
  //login and reach orders page
  const email = "priyanshujha@gmail.com";
  const productName = "ZARA COAT 3";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await page.getByPlaceholder("email@example.com").fill(email);
  await page.getByPlaceholder("enter your passsword").fill("Prj2314@");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForLoadState("networkidle");
  await page.locator(".card-body b").first().waitFor();
  await page.locator("[routerlink*='myorders']").first().click();
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=69da8dcff86ba51a655c552e",
      }),
  );
  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order",
  );
});
