import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrWhatIsYourCountryOfNationalityPage extends basePage {
    readonly countryOfNationalityField: Locator;

    constructor(page: Page) {
        super(page);
        this.countryOfNationalityField = page.locator('#country-of-nationality');
    }

    async expectedPageTitle(): Promise<string> {
        const title = await this.page.title();

        return title.startsWith('Error')
            ? 'Error: What is your country of nationality? – Request your reference number to get access to your eVisa'
            : 'What is your country of nationality? – Request your reference number to get access to your eVisa';
    }

    async completeWhatIsYourCountryOfNationalityPage(nationalityValue: string) {
        await this.assertPageTitle(this.page, await this.expectedPageTitle());

        const nationality = nationalityValue.trim().toLowerCase();
        const hasMatchingOption = await this.countryOfNationalityField.evaluate((element, value) => {
            const selectElement = element as HTMLSelectElement;

            return Array.from(selectElement.options).some(option => {
                return option.text.trim().toLowerCase() === value || option.value.trim().toLowerCase() === value;
            });
        }, nationality);

        if (hasMatchingOption) {
            await this.type(this.countryOfNationalityField, nationalityValue);
        } else {
            const autocompleteInput = this.page.locator('.autocomplete__input').first();

            if (await autocompleteInput.isVisible().catch(() => false)) {
                await autocompleteInput.fill(nationalityValue);
                await this.page.keyboard.press('Tab');
            }
        }

        await this.clickContinueButton();
    }
}
