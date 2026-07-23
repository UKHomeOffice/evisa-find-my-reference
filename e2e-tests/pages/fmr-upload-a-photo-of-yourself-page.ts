import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import * as path from 'path';

export class fmrUploadAPhotoOfYourselfPage extends basePage {
  readonly fileUpload: Locator;
  // readonly fileUploadInput: Locator;
  readonly continueWithoutUploadButton: Locator;
  readonly fileUploadErrorMaxFileSize: Locator;
  readonly fileUploadErrorFileType: Locator;

  constructor(page: Page) {
    super(page);
    this.fileUpload = page.locator("input[type='file']");
    // this.fileUploadInput = page.locator('#file-upload');
    this.continueWithoutUploadButton = page.locator("[name='continueWithoutUpload']");
    this.fileUploadErrorMaxFileSize = page.locator('#file-upload-error-maxFileSize');
    this.fileUploadErrorFileType = page.locator('#file-upload-error-fileType');
  }

  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Upload a photo of yourself – Request your reference number to get access to your eVisa'
      : 'Upload a photo of yourself – Request your reference number to get access to your eVisa';
  }

  getUploadFilePath(fileName: string): string {
    return path.resolve(process.cwd(), 'e2e-tests', 'test-data', fileName);
  }

  async uploadFileFromUserUploadFolder(fileName: string) {
    await this.fileUpload.setInputFiles(this.getUploadFilePath(fileName));
  }

  async selectContinueUploadButton() {
    await this.click(this.continueWithoutUploadButton.first());
  }

  async getMaxUploadFileErrorText(): Promise<string | null> {
    return this.fileUploadErrorMaxFileSize.textContent();
  }

  async getFileTypeUploadErrorText(): Promise<string | null> {
    return this.fileUploadErrorFileType.textContent();
  }

  async completeUploadAPhotoOfYourselfPage(fileName: string) {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.uploadFileFromUserUploadFolder(fileName);
    await this.selectContinueUploadButton();
  }
}
