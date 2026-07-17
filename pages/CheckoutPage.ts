import { type Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    async clickContinue(): Promise<void> {
        await this.page.locator('[data-test="continue"]').click();
    }

    async clickFinishButton(): Promise<void> {
        await this.page.locator('[data-test="finish"]').click();
    }

    async getSuccessMessage(): Promise<string> {
        const successMessageLocator = this.page.locator('.complete-header');
        return (await successMessageLocator.textContent()) ?? "";
    }
}