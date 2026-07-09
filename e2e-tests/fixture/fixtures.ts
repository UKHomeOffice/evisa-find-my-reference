import { test as base } from 'playwright-bdd';
import { basePage } from '../pages/base-page';
import { fmrHomePage } from '../pages/fmr-home-page';
import { fmrWhatIsYourNamePage } from '../pages/fmr-what-is-your-name-page';
import { fmrWhatIsYourSexPage } from '../pages/fmr-what-is-your-sex-page';
import { fmrWhatIsYourCountryOfNationalityPage } from '../pages/fmr-what-is-your-country-of-nationality-page';
import { fmrWhatIsYourDateOfBirthPage } from '../pages/fmr-what-is-your-date-of-birth-page';
import { fmrUploadAPhotoOfYourselfPage } from '../pages/fmr-upload-a-photo-of-yourself-page';
import { fmrIsThereAnythingElseYouCanTellUsPage } from '../pages/fmr-is-there-anything-else-you-can-tell-us-page';
import { fmrHowWouldYouLikeUsToContactYouPage } from '../pages/fmr-how-would-you-like-us-to-contact-you-page';
import { fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage } from '../pages/fmr-are-you-completing-this-on-behalf-of-someone-else-page';
import { fmrWhatAreYourDetailsPage } from '../pages/fmr-what-are-your-details-page';
import { fmrCheckYourAnswersPage } from '../pages/fmr-check-your-answers-page';
import { fmrRequestSentPage } from '../pages/fmr-request-sent-page';

export type Pages = {
  basePage: basePage;
  fmrHomePage: fmrHomePage;
  fmrWhatIsYourNamePage: fmrWhatIsYourNamePage;
  fmrWhatIsYourSexPage: fmrWhatIsYourSexPage;
  fmrWhatIsYourCountryOfNationalityPage: fmrWhatIsYourCountryOfNationalityPage;
  fmrWhatIsYourDateOfBirthPage: fmrWhatIsYourDateOfBirthPage;
  fmrUploadAPhotoOfYourselfPage: fmrUploadAPhotoOfYourselfPage;
  fmrIsThereAnythingElseYouCanTellUsPage: fmrIsThereAnythingElseYouCanTellUsPage;
  fmrHowWouldYouLikeUsToContactYouPage: fmrHowWouldYouLikeUsToContactYouPage;
  fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage: fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage;
  fmrWhatAreYourDetailsPage: fmrWhatAreYourDetailsPage;
  fmrCheckYourAnswersPage: fmrCheckYourAnswersPage;
  fmrRequestSentPage: fmrRequestSentPage;
};

export const test = base.extend<{ pages: Pages }>({
  pages: async ({ page }, use) => {
    await use({
      basePage: new basePage(page),
      fmrHomePage: new fmrHomePage(page),
      fmrWhatIsYourNamePage: new fmrWhatIsYourNamePage(page),
      fmrWhatIsYourSexPage: new fmrWhatIsYourSexPage(page),
      fmrWhatIsYourCountryOfNationalityPage: new fmrWhatIsYourCountryOfNationalityPage(page),
      fmrWhatIsYourDateOfBirthPage: new fmrWhatIsYourDateOfBirthPage(page),
      fmrUploadAPhotoOfYourselfPage: new fmrUploadAPhotoOfYourselfPage(page),
      fmrIsThereAnythingElseYouCanTellUsPage: new fmrIsThereAnythingElseYouCanTellUsPage(page),
      fmrHowWouldYouLikeUsToContactYouPage: new fmrHowWouldYouLikeUsToContactYouPage(page),
      fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage: new fmrAreYouCompletingThisOnBehalfOfSomeoneElsePage(page),
      fmrWhatAreYourDetailsPage: new fmrWhatAreYourDetailsPage(page),
      fmrCheckYourAnswersPage: new fmrCheckYourAnswersPage(page),
      fmrRequestSentPage: new fmrRequestSentPage(page),
    });
  },
});

export const expect = test.expect;
