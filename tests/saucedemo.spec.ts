import { test, expect, Page } from "@playwright/test";

test.describe('Saucedemo tests', () => {

    async function successfulLogin(page: Page) {
        await page.goto('/');
        await expect(page).toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
    };

    test('Valid user can log in and see inventory page', async ({ page }) => {
        await successfulLogin(page);
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
        await successfulLogin(page);

        const products = await page.locator('[data-test="inventory-item"]');
        await page.locator('#item_0_title_link').first().click();
        const productName = await page.locator('[data-test="inventory-item-name"]').textContent();
        await expect(productName, 'Product name should be correct').toBe('Sauce Labs Bike Light');
    });

    test('Add to cart and then Remove', async ({ page }) => {
        await successfulLogin(page);

        const products = await page.locator('[data-test="inventory-item"]');
        console.log(await products.count());
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should have 1 item").toHaveText('1');

        await page.locator('.shopping_cart_badge').click();
        await expect(page, "Should be redirected to the cart page").toHaveURL(/cart.html/);
        await page.getByRole('button', { name: 'Remove' }).click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should be empty").toHaveCount(0);
    });

    test('Locked user cannot log in and sees correct error', async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="username"]').fill('locked_out_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        const error = page.locator('[data-test="error"]');
        await expect(error, 'Locked out user should see a locked-out error message').toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('User can add two products to cart and verify badge count', async ({ page }) => {
        await successfulLogin(page);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        await expect(page.locator('.shopping_cart_badge'), "Cart should have 2 items").toHaveText('2');
    });

    test('User can remove one product and verify cart updates', async ({ page }) => {
        await successfulLogin(page);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should have 1 item").toHaveText('1');

        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(page.locator('.shopping_cart_badge'), "Cart should be empty").toHaveCount(0);
    });

    test('User can complete checkout and see success message', async ({ page }) => {
        await successfulLogin(page);
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('.shopping_cart_badge').click();
        await expect(page, "Should be redirected to the cart page").toHaveURL(/cart.html/);
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "Should be redirected to the checkout page").toHaveURL(/checkout-step-one.html/);

        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click();

        await expect(page, "Should be redirected to the checkout overview page").toHaveURL(/checkout-step-two.html/);
        await page.locator('[data-test="finish"]').click();

        await expect(page, "Should be redirected to the checkout complete page").toHaveURL(/checkout-complete.html/);
        const successMessage = page.locator('.complete-header');
        await expect(successMessage, "Success message should be visible").toHaveText('Thank you for your order!');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});