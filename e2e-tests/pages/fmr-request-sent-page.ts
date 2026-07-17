import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrRequestSentPage extends basePage {
  readonly finishAndReturnToGovUkButton: Locator;

  constructor(page: Page) {
    super(page);
    this.finishAndReturnToGovUkButton = page.getByRole('link', { name: 'Finish and return to GOV.UK' });
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Request sent – Request your reference number to get access to your eVisa'
      : 'Request sent – Request your reference number to get access to your eVisa';
  }

  async completeRequestSentPage() {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
  }

  async isFinishAndReturnToGovUkButtonDisplayed() {
    return this.finishAndReturnToGovUkButton.isVisible();
  }
}
