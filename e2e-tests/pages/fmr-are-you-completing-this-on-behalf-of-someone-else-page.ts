import { Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage extends basePage {
  constructor(page: Page) {
    super(page);
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Are you completing this form on behalf of someone else? – Request your reference number to get access to your eVisa'
      : 'Are you completing this form on behalf of someone else? – Request your reference number to get access to your eVisa';
  }

  async completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(option: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectRadioOptionWithText(option);
    await this.clickContinueButton();
  }
}
