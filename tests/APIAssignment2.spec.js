const { test, expect, request } = require("@playwright/test");

const loginPayLoad = [
  {
    email: "priyanshujha@gmail.com",
    password: "Prj2314@",
  },
  {
    email: "priyanshujha@yahoo.com",
    password: "Prj2314@",
  },
];
async function loginAs(page) {
  await page.goto("https://eventhub.rahulshettyacademy.com/");
  await page.locator("#email").fill("priyanshujha@gmail.com");
  await page.locator("#password").fill("Prj2314@");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.locator("#nav-events").waitFor();
}

let tokeny;
let tokeng;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
    {
      data: loginPayLoad[1],
    },
  );
  const loginResponseJson = await loginResponse.json();
  tokeny = loginResponseJson.token;
  console.log(tokeny);
  expect(loginResponse.ok()).toBeTruthy();
});
test("test1", async ({ page }) => {
  //   page.addInitScript((value) => {
  //     window.localStorage.setItem("eventhub_token", value);
  //   }, token);await request.newContext();
  const apiContext = await request.newContext();
  const eventRes = await apiContext.get(
    "https://api.eventhub.rahulshettyacademy.com/api/events",
    {
      headers: {
        Authorization: `Bearer ${tokeny}`,
      },
    },
  );
  expect(eventRes.ok()).toBeTruthy();
  const eventResJson = await eventRes.json();
  const eventId = eventResJson.data[0].id;
  console.log(eventId);
  const bookingRes = await apiContext.post(
    "https://api.eventhub.rahulshettyacademy.com/api/bookings",
    {
      headers: {
        Authorization: `Bearer ${tokeny}`,
      },
      data: {
        eventId: eventId,
        customerName: "Yahoo user",
        customerEmail: loginPayLoad[1].email,
        customerPhone: 7250156110,
        quantity: 1,
      },
    },
  );
  expect(bookingRes.ok()).toBeTruthy();
  const bookingResJson = await bookingRes.json();
  const yahooBookingId = bookingResJson.data.id;
  console.log(yahooBookingId);
  await loginAs(page);
  await page.goto(
    `https://eventhub.rahulshettyacademy.com/bookings/${yahooBookingId}`,
    { waitUntil: "networkidle" },
  );
  await expect(page.getByText("Access Denied")).toBeVisible();
  await expect(
    page.getByText("You are not authorized to view this booking."),
  ).toBeVisible();
});
