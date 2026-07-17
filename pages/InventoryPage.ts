import { type Page } from "@playwright/test";
import { CartPage } from "./CartPage";

export class InventoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getProductNameByIndex(index: number): Promise<string> {
        const productLocator = this.page.locator('[data-test="inventory-item"]').nth(index);
        return (await productLocator.locator('[data-test="inventory-item-name"]').textContent()) ?? "";
    }

    async clickAddToCartByIndex(index: number): Promise<number> {
        const productLocator = this.page.locator('[data-test="inventory-item"]').nth(index);
        await productLocator.getByRole('button', { name: /Add to cart/i }).click();
        return this.getCartCount();
    }

    async clickRemoveFromCartByIndex(index: number): Promise<number> {
        const productLocator = this.page.locator('[data-test="inventory-item"]').nth(index);
        await productLocator.locator('[data-test^="remove"]').click();
        return this.getCartCount();
    }

    private async getCartCount(): Promise<number> {
        const cartBadge = this.page.locator('.shopping_cart_badge');
        if (await cartBadge.count() === 0) {
            return 0;
        }

        const badgeText = await cartBadge.textContent();
        return Number.parseInt(badgeText ?? "0", 10) || 0;
    }

    async clickCartIcon(): Promise<CartPage> {
        await this.page.locator('.shopping_cart_link').click();
        return new CartPage(this.page);
    }
}