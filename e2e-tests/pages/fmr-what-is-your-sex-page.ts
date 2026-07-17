import { Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrWhatIsYourSexPage extends basePage {
  constructor(page: Page) {
    super(page);
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What is your sex? – Request your reference number to get access to your eVisa'
      : 'What is your sex? – Request your reference number to get access to your eVisa';
  }

  async completeWhatIsYourSexPage(option: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectRadioOptionWithText(option);
    await this.clickContinueButton();
  }
}
