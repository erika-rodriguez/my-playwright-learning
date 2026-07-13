import {test, expect} from "@playwright/test";

test.describe('Saucedemo tests', () => {

    test.beforeEach('Successful login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        await expect(page, 'Should be redirected to the inventory page').toHaveURL(/inventory.html/);
    });

    test('Failed login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('wrong_password');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]'), "Error should appear for wrong credentials").toBeVisible();
    });

    test('Empty form validation', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]'), "Error should appear for empty form").toBeVisible();
    });

    test('Inventory testing', async ({ page }) => {
        const products = await page.locator('[data-test="inventory-item"]');
        console.log(await products.count());
        await products.filter({ hasText: 'Sauce Labs Bike Light' }).click();
        await expect(page, 'Should be redirected to the product details page').toHaveURL(/inventory-item.html?id=0/);
    });

    test('Add to cart and then Remove', async ({ page }) => {
        const products = await page.locator('[data-test="inventory-item"]');
        console.log(await products.count());
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should have 1 item").toHaveText('1');

        await page.locator('.shopping_cart_badge').click();
        await expect(page, "Should be redirected to the cart page").toHaveURL(/cart.html/);
        await page.getByRole('button', { name: 'Remove' }).click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should be empty").toHaveCount(0);
    });
})