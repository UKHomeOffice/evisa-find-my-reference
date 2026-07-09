import { Locator, Page, expect } from '@playwright/test';
import { basePage } from './base-page';

export class fmrHomePage extends basePage {
    readonly startButton: Locator;
    readonly acceptCookieButton: Locator;
    readonly hideThisMessageButton: Locator;

    constructor(page: Page) {
        super(page);
        this.startButton = page.locator('button.govuk-button--start, a:has-text("Start now")');
        this.acceptCookieButton = page.locator('#accept-cookies-button');
        this.hideThisMessageButton = page.locator('#hide-accept-cookie-banner');
    }

    async expectedPageTitle(): Promise<string> {
        const title = await this.page.title();

        return title.startsWith('Error')
            ? 'Error: Request your reference number to get access to your eVisa'
            : 'Request your reference number to get access to your eVisa';
    }

    async openFmrHomepage() {
        await this.page.goto('/');
    }

    async acceptCookiesIfPresent() {
        if (await this.acceptCookieButton.isVisible()) {
            await this.click(this.acceptCookieButton);
        }

        if (await this.hideThisMessageButton.isVisible()) {
            await this.click(this.hideThisMessageButton);
        }
    }

    async clickStartNowButton() {
        await this.click(this.startButton.first());
    }

    async assertHelpLinks() {
        expect(await this.getUrlForLinkText('Biometric residence permits (BRPs)')).toBe('https://www.gov.uk/biometric-residence-permits');
        expect(await this.getUrlForLinkText('Update your UK Visas and Immigration account details')).toBe('https://www.gov.uk/update-uk-visas-immigration-account-details');
        expect(await this.getUrlForLinkText('View and prove your immigration status: get a share code')).toBe('https://www.gov.uk/view-prove-immigration-status');
        // expect(await this.getUrlForLinkText('get access to your eVisa')).toBe('https://www.gov.uk/get-access-evisa');
    }

    async completeHomePage() {
        await this.assertPageTitle(this.page, await this.expectedPageTitle());
        await this.acceptCookiesIfPresent();
        await this.assertHelpLinks();
        await this.clickStartNowButton();
    }
}
