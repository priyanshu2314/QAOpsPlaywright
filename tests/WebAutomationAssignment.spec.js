const { test, expect } = require("@playwright/test");

test("login", async ({ page }) => {
  await page.goto("https://eventhub.rahulshettyacademy.com/");
  await page.getByPlaceholder("you@email.com").fill("priyanshujha@gmail.com");
  await page.getByLabel("Password").fill("Prj2314@");
  await page.locator("#login-btn").click();
  await expect(page.getByText("Browse Events →")).toBeVisible();
  await page.getByRole("button", { name: "Admin" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Manage Events" })
    .click();
  const eventTitle = `Event title ${Date.now()}`;
  await page.locator("#event-title-input").fill(eventTitle);
  await page.locator("#admin-event-form textarea").fill("Description");
  await page.getByLabel("City").fill("Kolkata");
  await page.getByLabel("Venue").fill("Venue Details");
  await page.getByLabel("Event Date & Time").fill("2026-09-11T11:59");
  await page.getByLabel("Price ($)").fill("100");
  await page.getByLabel("Total Seats").fill("70");
  await page.locator("#add-event-btn").click();
  await expect(page.getByText("Event created!")).toBeVisible();
  await page.locator("#nav-events").click();
  const cards = await page.locator("[data-testid='event-card']");
  await expect(cards.nth(0)).toBeVisible();
  await page.getByPlaceholder("Search events, venues…").fill(eventTitle);
  await expect(page.getByRole("link", { name: eventTitle })).toBeVisible({
    timeout: 5000,
  });
  const targetEvent = page
    .locator("article[data-testid='event-card']")
    .filter({ hasText: eventTitle });
  const seatsBeforeBooking = parseInt(
    await targetEvent.getByText("seats available").innerText(),
  );
  await page.waitForTimeout(5000);
  await page.getByTestId("book-now-btn").click();
  await page.getByLabel("Full Name").fill("Priyanshu Jha");
  await page.locator("#customer-email").fill("pjha@gmail.com");
  await page.getByPlaceholder("+91 98765 43210").fill("7250156109");
  await page.locator(".confirm-booking-btn").click();
  const bookingRef = (
    await page.locator(".booking-ref").first().innerText()
  ).trim();
  await expect(page.locator(".booking-ref").first()).toBeVisible();
  await page.getByTestId("nav-bookings").click();
  await expect(page).toHaveURL(/bookings/);
  const bookingCards = await page.locator("#booking-card");
  await expect(bookingCards.first()).toBeVisible();
  for (let i = 0; i < bookingCards.count(); i++) {
    if (
      bookingCards.nth(i).locator(".booking-ref").textContent() === bookingRef
    ) {
      await expect(bookingCards.nth(i).locator(".booking-ref")).toBeVisible();
      await expect(bookingCards.nth(i)).hasText(eventTitle);
      break;
    }
  }
  await page.locator("#nav-events").click();
  await expect(cards.nth(0)).toBeVisible();
  await expect(page.getByRole("link", { name: eventTitle })).toBeVisible({
    timeout: 5000,
  });
  await page.waitForTimeout(5000);
  const seatsAfterBooking = parseInt(
    await targetEvent.getByText("seats available").innerText(),
  );

  await page.waitForTimeout(5000);
  await expect(seatsBeforeBooking - seatsAfterBooking).toBe(1);
});
