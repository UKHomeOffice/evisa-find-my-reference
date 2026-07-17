# E2E FMR Tests

This folder contains Playwright BDD end-to-end tests for the Find my reference (FMR) journey.

## Structure

- `features/`: Gherkin scenarios migrated from Selenium BDD
- `steps/`: Playwright-BDD step definitions
- `fixture/`: shared fixtures and page object wiring
- `pages/`: page object model classes
- `utility-helper/`: constants and helper utilities

## Run

From `evisa-find-my-reference` root:

```powershell
yarn install
npx playwright install chromium
yarn test:e2e
```
