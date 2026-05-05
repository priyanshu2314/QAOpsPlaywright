const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("../Utils/APIUtils");
const loginPayLoad = {
  userEmail: "priyanshujha@gmail.com",
  userPassword: "Prj2314@",
};
const orderPayLoad = {
  orders: [
    {
      country: "Cuba",
      productOrderedId: "6960eae1c941646b7a8b3ed3",
    },
  ],
};
let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test("@API Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("[routerlink*='myorders']").first().click();
  await page.locator(".table [scope='row']").first().waitFor();
  const rows = page.locator("tbody tr");
  let flag = 0;
  for (let i = 0; i < (await rows.count()); i++) {
    if (
      response.orderId.includes(await rows.nth(i).locator("th").textContent())
    ) {
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
  await page.pause();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
  //await page.pause();
});
