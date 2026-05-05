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
const fakePayLoadOrder = { data: [], message: "No Orders" };
let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test("Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/69c10629f86ba51a651e9f5f",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrder);
      route.fulfill({
        response,
        body,
      });
      //intercepting the response->API reponse->{playwright fake response}->browser->render data on front end
    },
  );

  await page.locator("[routerlink*='myorders']").first().click();
  //await page.pause();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/69c10629f86ba51a651e9f5f",
  );
  console.log(await page.locator(".mt-4").textContent());
});
