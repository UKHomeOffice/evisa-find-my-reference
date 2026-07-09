import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrCheckYourAnswersPage extends basePage {
  readonly submitRequestButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitRequestButton = page.locator('#report-submit .govuk-button, input[value="Submit request"]');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Request your reference number to get access to your eVisa'
      : 'Check your answers before sending your request – Request your reference number to get access to your eVisa';
  }

  async completeCheckYourAnswersPage() {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.click(this.submitRequestButton.first());
  }
}
