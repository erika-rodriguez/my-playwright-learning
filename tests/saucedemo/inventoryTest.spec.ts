import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

test.describe("Inventory", () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        loginPage.login("standard_user", "secret_sauce");
        inventoryPage = new InventoryPage(page);
    });

    test("add to cart and remove from cart", async () => {
        const initialCartCount = await inventoryPage.clickAddToCartByIndex(0);
        expect(initialCartCount, "Cart count after adding item is not correct").toBe(1);

        const updatedCartCount = await inventoryPage.clickRemoveFromCartByIndex(0);
        expect(updatedCartCount, "Cart count after removing item is not correct").toBe(0);
    });
});