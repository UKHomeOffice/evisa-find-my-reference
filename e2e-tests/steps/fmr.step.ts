import { DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';
import type { Pages } from '../fixture/fixtures';
import { ConstantsLib as c } from '../utility-helper/constants-lib';

export const { Given, When, Then } = createBdd(test);

// const completeHomePage = async (pages: Pages) => {
//   await pages.fmrHomePage.completeHomePage();

//   expect(await pages.fmrHomePage.getUrlForLinkText('Biometric residence permits (BRPs)')).toBe(c.BIOMETRIC_RESIDENCE_PERMITS_URL);
//   expect(await pages.fmrHomePage.getUrlForLinkText('Update your UK Visas and Immigration account details')).toBe(c.UPDATE_UK_VISAS_AND_IMMIGRATION_ACCOUNT_DETAILS_URL);
//   expect(await pages.fmrHomePage.getUrlForLinkText('View and prove your immigration status: get a share code')).toBe(c.VIEW_AND_PROVE_YOUR_IMMIGRATION_STATUS_URL);
//   expect(await pages.fmrHomePage.getUrlForLinkText('get access to your eVisa')).toBe(c.GET_ACCESS_TO_EVISA_URL);
// };


Given('I visit the Find my reference page', async ({ pages }) => {
    await pages.fmrHomePage.openFmrHomepage();
    await pages.fmrHomePage.acceptCookiesIfPresent();
});

When('I fill out the answers to FMR form pertaining to {string} happy path test', async ({ pages }, scenario: string) => {
    await pages.fmrHomePage.completeHomePage();

    switch (scenario.toLowerCase()) {
        case 'yes to passport, contact via email and form completed on behalf of someone else':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Male');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            await pages.fmrIsThereAnythingElseYouCanTellUsPage.completeIsThereAnythingElseYouCanTellUsPage(c.TEXT_VALUE);
            await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaEmailPage('Email', c.SAS_HOF_EMAIL);
            await pages.fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage('Yes');
            await pages.fmrWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
            break;

        case 'no to passport contact with email and form completed by themself':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Female');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            await pages.fmrIsThereAnythingElseYouCanTellUsPage.completeIsThereAnythingElseYouCanTellUsPage(c.TEXT_VALUE);
            await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaEmailPage('Email', c.SAS_HOF_EMAIL);
            await pages.fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage('No');
            break;

        case 'yes to passport contact with uk address and form completed on behalf of someone else':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('X or other');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            await pages.fmrIsThereAnythingElseYouCanTellUsPage.completeIsThereAnythingElseYouCanTellUsPage(c.TEXT_VALUE);
            await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaUkAddressPage(
                'UK address',
                c.ADDRESS_LINE_1,
                c.ADDRESS_LINE_2,
                c.TOWN_OR_CITY,
                c.COUNTY,
                c.POSTCODE,
            );
            await pages.fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage('Yes');
            await pages.fmrWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(c.FULL_NAME, c.SAS_HOF_EMAIL, 'Sponsor');
            break;

        case 'no to passport contact with uk address and form completed by themself':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Female');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            await pages.fmrIsThereAnythingElseYouCanTellUsPage.completeIsThereAnythingElseYouCanTellUsPage(c.TEXT_VALUE);
            await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaUkAddressPage(
                'UK address',
                c.ADDRESS_LINE_1,
                c.ADDRESS_LINE_2,
                c.TOWN_OR_CITY,
                c.COUNTY,
                c.POSTCODE,
            );
            await pages.fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage('No');
            break;

        default:
            throw new Error(`Invalid scenario: ${scenario}`);
    }

    await pages.fmrCheckYourAnswersPage.completeCheckYourAnswersPage();
});


const navigateToPage = async (pages: Pages, pageName: string) => {
    await pages.fmrHomePage.completeHomePage();

    switch (pageName.toLowerCase()) {
        case 'what is your name?':
            break;

        case 'upload a photo of yourself':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Male');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            break;

        case 'is there anything else you can tell us that may help us find your record?':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Male');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            break;

        case 'are you completing this form on behalf of someone else?':
            await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(c.GIVEN_NAMES, c.SURNAME);
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage('Male');
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(c.NATIONALITY);
            await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(c.DOB_1978);
            await pages.fmrUploadAPhotoOfYourselfPage.completeUploadAPhotoOfYourselfPage('yourself.png');
            await pages.fmrIsThereAnythingElseYouCanTellUsPage.completeIsThereAnythingElseYouCanTellUsPage(c.TEXT_VALUE);
            await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaEmailPage('Email', c.SAS_HOF_EMAIL);
            break;

        default:
            throw new Error(`Failed: Wrong page name: ${pageName}`);
    }
};


Then('I should see {string} page for FMR', async ({ pages }, expectedPageHeaderText: string) => {
    await pages.fmrRequestSentPage.completeRequestSentPage();
    await expect(pages.fmrRequestSentPage.headerText).toHaveText(expectedPageHeaderText);
});

Then('Finish and return to GOV.UK button is displayed for FMR', async ({ pages }) => {
    expect(await pages.fmrRequestSentPage.isFinishAndReturnToGovUkButtonDisplayed()).toBe(true);
});

When('I choose to navigate to {string} page for FMR', async ({ pages }, pageName: string) => {
    await navigateToPage(pages, pageName);
});

When('I select continue', async ({ pages }) => {
    await pages.basePage.clickContinueButton();
});

When('I select continue on upload photo', async ({ pages }) => {
    await pages.fmrUploadAPhotoOfYourselfPage.selectContinueUploadButton();
});

Then('I should see {string} error message displayed', async ({ pages }, expectedErrorMessage: string) => {
    const actualErrorMessage = await pages.basePage.getThereIsAProblemTextErrorText();
    expect(actualErrorMessage).toBe(expectedErrorMessage);
});

Then('I should see {string} error summary', async ({ pages }, expectedErrorMessage: string) => {
    const expectedErrorArray = expectedErrorMessage.trim().split('¬');

    const actualText = await pages.basePage.getErrorSummaryListText();
    const actualErrorArray = actualText
        ?.replace(/\t/g, '')
        .trim()
        .split(/\r?\n/);

    expect(actualErrorArray).toEqual(expectedErrorArray);
});

When('I complete the fields below with What is your name details:', async ({ pages }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    await pages.fmrWhatIsYourNamePage.completeWhatIsYourNamePage(data['Given names'], data.Surname);
});

When('I answer {string} on {string} page for FMR and choose to continue', async ({ pages }, answer: string, pageName: string) => {
    switch (pageName.toLowerCase()) {
        case 'what is your sex?':
            await pages.fmrWhatIsYourSexPage.completeWhatIsYourSexPage(answer);
            break;

        case 'what is your country of nationality?':
            await pages.fmrWhatIsYourCountryOfNationalityPage.completeWhatIsYourCountryOfNationalityPage(answer);
            break;

        case 'are you completing this form on behalf of someone else?':
            await pages.fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage.completeAreYouCompletingThisOnBehalfOfSomeoneElsePage(answer);
            break;

        default:
            throw new Error(`Failed: Wrong page name: ${pageName}`);
    }
});

When('I complete the fields below with What is your date of birth details:', async ({ pages }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    await pages.fmrWhatIsYourDateOfBirthPage.completeWhatIsYourDateOfBirthPage(data['Date of birth']);
});

When('I choose to upload {string} file', async ({ pages }, fileName: string) => {
    await pages.fmrUploadAPhotoOfYourselfPage.uploadFileFromUserUploadFolder(fileName);
});

When('I choose to upload another {string} file', async ({ pages }, fileName: string) => {
    await pages.fmrUploadAPhotoOfYourselfPage.uploadFileFromUserUploadFolder(fileName);
});

Then('I should see {string} error for max upload file', async ({ pages }, expectedErrorMessage: string) => {
    const actualError = await pages.fmrUploadAPhotoOfYourselfPage.getMaxUploadFileErrorText();
    expect(actualError?.replace('Error:', '').trim()).toBe(expectedErrorMessage);
});

Then('I should see {string} error for type of uploaded file', async ({ pages }, expectedErrorMessage: string) => {
    const actualError = await pages.fmrUploadAPhotoOfYourselfPage.getFileTypeUploadErrorText();
    expect(actualError?.replace('Error:', '').trim()).toBe(expectedErrorMessage);
});

When('I enter {string} characters in {string} page for FMR', async ({ pages }, length: string, _pageName: string) => {
    const textValue = pages.basePage.generateRandomAlphabetString(Number.parseInt(length, 10));
    await pages.fmrIsThereAnythingElseYouCanTellUsPage.enterText(textValue);
});

When('I complete the fields below with How would you like us to contact you via email details:', async ({ pages }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaEmailPage(data['Radio Option'], data['Email Value']);
});

When('I complete the fields below with How would you like us to contact you via uk address details:', async ({ pages }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    await pages.fmrHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouViaUkAddressPage(
        data['Radio Option'],
        data['Address line 1'],
        data['Address line 2'],
        data['Town or City'],
        data.Country,
        data.Postcode,
    );
});

When('I complete the fields below with What are your details:', async ({ pages }, dataTable: DataTable) => {
    const data = dataTable.rowsHash();

    await pages.fmrWhatAreYourDetailsPage.completeWhatAreYourDetailsPage(
        data['Full name'],
        data['Email address'],
        data['Type of support'],
    );
});
