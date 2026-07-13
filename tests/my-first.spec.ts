import { test, expect } from '@playwright/test';
import { format } from 'node:path';

// POSITIVE test — checks that something IS as expected
test('page has the correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

// NEGATIVE test — checks that something is NOT present.
// In QA, this is just as important as positive checks.
test('page does not contain error text', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // .not.toBeVisible() = assert the element is NOT visible on the page
  await expect(page.getByText('404 Page Not Found')).not.toBeVisible();
});

type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const bananas: Product = {
  name: 'Bananas',
  price: 1.99,
  inStock: true,
};

const apples: Product = {
  name: 'Apples',
  price: 2.49,
  inStock: false,
};

function formatPrice(price: number): string {
  return `!${price}`;
}

test('product has correct properties', async () => {
  console.log(`Product: ${bananas.name}, Price: ${formatPrice(bananas.price)}, In Stock: ${bananas.inStock}`);
  console.log(`Product: ${apples.name}, Price: ${formatPrice(apples.price)}, In Stock: ${apples.inStock}`);
  expect(bananas.name).toBe('Bananas');
  expect(bananas.price).toBeGreaterThan(0);
  expect(bananas.inStock).toBe(true);
});