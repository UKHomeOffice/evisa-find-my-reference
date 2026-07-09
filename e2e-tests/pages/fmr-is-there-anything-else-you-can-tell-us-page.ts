import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrIsThereAnythingElseYouCanTellUsPage extends basePage {
  readonly additionalInformationField: Locator;

  constructor(page: Page) {
    super(page);
    this.additionalInformationField = page.locator('#anything-else');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Is there anything else you can tell us that may help us find your record? – Request your reference number to get access to your eVisa'
      : 'Is there anything else you can tell us that may help us find your record? – Request your reference number to get access to your eVisa';
  }

  async completeIsThereAnythingElseYouCanTellUsPage(textValue: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.type(this.additionalInformationField, textValue);
    await this.clickContinueButton();
  }

  async enterText(textValue: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.additionalInformationField.fill('');
    await this.type(this.additionalInformationField, textValue);
  }
}
