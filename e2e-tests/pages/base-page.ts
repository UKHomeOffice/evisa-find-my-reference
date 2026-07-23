import { expect, Locator, Page } from '@playwright/test';

export class basePage {
    readonly page: Page;
    readonly headerText: Locator;
    readonly continueButton: Locator;
    readonly thereIsAProblemText: Locator;
    readonly errorSummaryList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerText = page.locator('h1');
        this.continueButton = page.locator("input[value='Continue'], button:has-text('Continue')");
        this.thereIsAProblemText = page.locator('#error-summary-title');
        this.errorSummaryList = page.locator("[class='govuk-list govuk-error-summary__list']");
    }

    async assertPageTitle(page: Page, title: string) {
        await expect(page).toHaveTitle(title + ' – GOV.UK');
    }

    async click(locator: Locator) {
        await locator.click();
    }

    async type(locator: Locator, text: string) {
        await locator.fill(text);
        await this.page.keyboard.press('Tab');
    }

    async clickContinueButton() {
        await this.click(this.continueButton.first());
    }

    async selectRadioOptionWithText(optionText: string) {
        await this.page.getByRole('radio', { name: optionText, exact: true }).check();
    }

    convertTextToDate(dateValue: string | null): string | null {
        if (dateValue == null) return null;

        const date = dateValue.trim().toLowerCase();
        if (!date) return dateValue;

        const now = new Date();

        const formatDate = (d: Date): string => {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const addDays = (d: Date, days: number) => {
            const newDate = new Date(d);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        };

        const addYears = (d: Date, years: number) => {
            const newDate = new Date(d);
            newDate.setFullYear(newDate.getFullYear() + years);
            return newDate;
        };

        const dateMappings: Record<string, () => Date> = {
            "yesterday's date": () => addDays(now, -1),
            "today's date": () => now,
            "tomorrow's date": () => addDays(now, 1),
            "less than 18 years ago": () => addDays(addYears(now, -18), 1),
            '19 years ago': () => addYears(now, -19),
        };

        const dateFn = dateMappings[date];

        return dateFn ? formatDate(dateFn()) : dateValue;
    }

    async enterDateOrDob(inputDate: string | null) {
        if (!inputDate?.trim()) return;

        const dayLocator = this.page.getByLabel('Day');
        const monthLocator = this.page.getByLabel('Month');
        const yearLocator = this.page.getByLabel('Year');

        const formattedDate = this.convertTextToDate(inputDate);

        if (!formattedDate) return;

        const dateParts = formattedDate.split('/');

        if (dateParts.length !== 3) {
            throw new Error('Invalid date format. Expected format: dd/MM/yyyy');
        }

        const [dayVal, monthVal, yearVal] = dateParts;

        await this.type(dayLocator, dayVal);
        await this.type(monthLocator, monthVal);
        await this.type(yearLocator, yearVal);
    }

    async linkTextIsDisplayed(linkText: string): Promise<boolean> {
        return this.page.getByRole('link', { name: linkText }).isVisible();
    }

    async getUrlForLinkText(linkText: string): Promise<string | null> {
        return this.page.getByRole('link', { name: linkText }).getAttribute('href');
    }

    async getThereIsAProblemTextErrorText(): Promise<string | null> {
        return this.thereIsAProblemText.textContent();
    }

    async getErrorSummaryListText(): Promise<string | null> {
        return this.errorSummaryList.textContent();
    }

    generateRandomAlphabetString(length: number): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        for (let i = 0; i < length; i += 1) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }
}
