import { test, expect } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Inventory", () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        loginPage.login("standard_user", "secret_sauce");
        inventoryPage = new InventoryPage(page);
    });

    test('User can complete checkout and see success message', async ({ page }) => {
        await inventoryPage.clickAddToCartByIndex(2);
        const cartPage = await inventoryPage.clickCartIcon();
        await expect(page, "Should be redirected to the cart page").toHaveURL(/cart.html/);
        const checkoutPage = await cartPage.clickCheckoutButton();
        await expect(page, "Should be redirected to the checkout page").toHaveURL(/checkout-step-one.html/);

        await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        await expect(page, "Should be redirected to the checkout overview page").toHaveURL(/checkout-step-two.html/);
        await checkoutPage.clickFinishButton();
        await expect(page, "Should be redirected to the checkout complete page").toHaveURL(/checkout-complete.html/);
        await expect(checkoutPage.getSuccessMessage(), "Success message should be displayed").resolves.toBe('Thank you for your order!');
    });
});