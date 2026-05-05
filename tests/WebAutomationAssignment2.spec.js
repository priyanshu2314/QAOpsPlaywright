const { test, expect } = require("@playwright/test");

async function loginAndGoToBooking(page) {
  await page.goto("https://eventhub.rahulshettyacademy.com/");
  await page.getByPlaceholder("you@email.com").fill("priyanshujha@gmail.com");
  await page.getByLabel("Password").fill("Prj2314@");
  await page.locator("#login-btn").click();
  await expect(page.getByText("Browse Events →")).toBeVisible();
}

test("login", async ({ page }) => {
  await loginAndGoToBooking(page);
  await page.locator("#nav-events").click();
  await page
    .getByTestId("event-card")
    .first()
    .getByTestId("book-now-btn")
    .click();
  //await page.pause();
  await page.locator('button:has-text("+")').dblclick();
  await page.getByLabel("Full Name").fill("Priyanshu Jha");
  await page.locator("#customer-email").fill("pjha@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("7250156109");
  await page.locator(".confirm-booking-btn").click();
  await page.getByTestId("nav-bookings").click();
  await expect(page).toHaveURL(/bookings/);
  await page.getByRole("button", { name: "View Details" }).first().click();
  await expect(page.getByText("Booking Information")).toBeVisible();
  const bookingRef = await page
    .locator(".items-start .items-center span")
    .first()
    .textContent();
  const eventTitle = await page.locator("h1").textContent();
  expect(bookingRef[0] === eventTitle[0]).toBeTruthy();
  await page.getByTestId("check-refund-btn").click();
  await expect(page.locator("#refund-spinner")).toBeVisible();
  await expect(page.locator("#refund-spinner")).toBeHidden({ timeout: 6000 });
  const res = await page.locator("#refund-result");
  await expect(res).toBeVisible();
  expect(await res.textContent()).toContain("Not eligible for refund.");
  expect(await res.textContent()).toContain(
    "Group bookings (3 tickets) are non-refundable.",
  );
});
