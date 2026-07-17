import { type Page } from "@playwright/test";
import { CheckoutPage } from "./CheckoutPage";

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickCheckoutButton(): Promise<CheckoutPage> {
        await this.page.locator('[data-test="checkout"]').click();
        return new CheckoutPage(this.page);
    }

}
