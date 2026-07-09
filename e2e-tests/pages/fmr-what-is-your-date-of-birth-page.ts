import { Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrWhatIsYourDateOfBirthPage extends basePage {
  constructor(page: Page) {
    super(page);
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What is your date of birth? – Request your reference number to get access to your eVisa'
      : 'What is your date of birth? – Request your reference number to get access to your eVisa';
  }

  async completeWhatIsYourDateOfBirthPage(dobValue: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.enterDateOrDob(dobValue);
    await this.clickContinueButton();
  }
}
