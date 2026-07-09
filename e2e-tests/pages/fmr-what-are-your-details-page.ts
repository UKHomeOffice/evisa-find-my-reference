import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrWhatAreYourDetailsPage extends basePage {
  readonly fullNameField: Locator;
  readonly emailAddressField: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameField = page.locator('#someone-else-name');
    this.emailAddressField = page.locator('#someone-else-email');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What are your details? – Request your reference number to get access to your eVisa'
      : 'What are your details? – Request your reference number to get access to your eVisa';
  }

  async completeWhatAreYourDetailsPage(fullName: string, emailAddress: string, supportOptionValue: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.type(this.fullNameField, fullName);
    await this.type(this.emailAddressField, emailAddress);
    await this.selectRadioOptionWithText(supportOptionValue);
    await this.clickContinueButton();
  }
}
