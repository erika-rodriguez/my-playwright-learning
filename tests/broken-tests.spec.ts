import { test, expect } from "@playwright/test";

test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");   // ← is this the real placeholder? NO, the correct one is Username
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});

test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    "Epic sadface: Username and password do not match any user in this service"   // ← is this the exact text? No, the correct text content is this one ContainText is partial match
  );
});

test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here.  Yes, missing the await before page.locator

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});