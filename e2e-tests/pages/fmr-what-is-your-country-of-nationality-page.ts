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
        await this.type(this.countryOfNationalityField, nationalityValue);

        await this.clickContinueButton();
    }
}
