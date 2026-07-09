import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrWhatIsYourNamePage extends basePage {
  readonly givenNamesField: Locator;
  readonly surnameField: Locator;

  constructor(page: Page) {
    super(page);
    this.givenNamesField = page.locator('#given-names');
    this.surnameField = page.locator('#surname');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: What is your name? – Request your reference number to get access to your eVisa'
      : 'What is your name? – Request your reference number to get access to your eVisa';
  }

  async completeWhatIsYourNamePage(givenNames: string, surname: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.type(this.givenNamesField, givenNames);
    await this.type(this.surnameField, surname);
    await this.clickContinueButton();
  }
}
