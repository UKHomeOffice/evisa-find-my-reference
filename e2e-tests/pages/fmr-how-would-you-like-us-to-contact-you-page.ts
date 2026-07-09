import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';

export class fmrHowWouldYouLikeUsToContactYouPage extends basePage {
  readonly emailField: Locator;
  readonly addressLine1TextField: Locator;
  readonly addressLine2TextField: Locator;
  readonly townOrCityTextField: Locator;
  readonly countyTextField: Locator;
  readonly postCodeField: Locator;

  constructor(page: Page) {
    super(page);
    this.emailField = page.locator('#email');
    this.addressLine1TextField = page.locator('#address-line-1');
    this.addressLine2TextField = page.locator('#address-line-2');
    this.townOrCityTextField = page.locator('#town-or-city');
    this.countyTextField = page.locator('#county');
    this.postCodeField = page.locator('#postcode');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: How would you like us to contact you? – Request your reference number to get access to your eVisa'
      : 'How would you like us to contact you? – Request your reference number to get access to your eVisa';
  }

  async completeHowWouldYouLikeUsToContactYouViaEmailPage(radioOption: string, emailValue: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectRadioOptionWithText(radioOption);
    await this.type(this.emailField, emailValue);
    await this.clickContinueButton();
  }

  async completeHowWouldYouLikeUsToContactYouViaUkAddressPage(
    radioOption: string,
    addressLine1: string,
    addressLine2: string,
    townOrCity: string,
    county: string,
    postCode: string,
  ) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectRadioOptionWithText(radioOption);
    await this.type(this.addressLine1TextField, addressLine1);
    await this.type(this.addressLine2TextField, addressLine2);
    await this.type(this.townOrCityTextField, townOrCity);
    await this.type(this.countyTextField, county);
    await this.type(this.postCodeField, postCode);
    await this.clickContinueButton();
  }
}
