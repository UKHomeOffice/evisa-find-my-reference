@FmrRegression
Feature: FMR - Find my reference

  Scenario: FMR - Field validation error message check for What is your name?, What is your sex?, What is your country of nationality? and
    Given I visit the Find my reference page
    When I choose to navigate to "What is your name?" page for FMR
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a surname" error summary
    When I complete the fields below with What is your name details:
      | Given names | 1Ful Sam |
      | Surname     | 12Ted    |
    Then I should see "There is a problem" error message displayed
    And I should see "Given names must only include letters a to z, spaces, hyphens and apostrophes¬Surname must only include letters a to z, spaces, hyphens and apostrophes" error summary
    When I complete the fields below with What is your name details:
      | Given names | Ful$ Sam |
      | Surname     | T&ed     |
    Then I should see "There is a problem" error message displayed
    And I should see "Given names must only include letters a to z, spaces, hyphens and apostrophes¬Surname must only include letters a to z, spaces, hyphens and apostrophes" error summary
    When I complete the fields below with What is your name details:
      | Given names | Full Sam |
      | Surname     | Ted      |
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select a sex" error summary
    When I answer "Male" on "What is your sex?" page for FMR and choose to continue
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a country of nationality" error summary
    When I answer "England" on "What is your country of nationality?" page for FMR and choose to continue
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a country of nationality" error summary
    When I answer "Spain" on "What is your country of nationality?" page for FMR and choose to continue
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your date of birth" error summary
    When I complete the fields below with What is your date of birth details:
      | Date of birth | 01/13/1985 |
    Then I should see "There is a problem" error message displayed
    And I should see "The date must only contain numbers. For example, 31 3 1980." error summary
    When I complete the fields below with What is your date of birth details:
      | Date of birth | 0A/10/1985 |
    Then I should see "There is a problem" error message displayed
    And I should see "The date must only contain numbers. For example, 31 3 1980." error summary
    When I complete the fields below with What is your date of birth details:
      | Date of birth | tomorrow's date |
    Then I should see "There is a problem" error message displayed
    And I should see "Date of birth must be in the past" error summary

  Scenario: FMR - Validation error message for upload a photo of yourself page and Is there anything else you can tell us page
    Given I visit the Find my reference page
    When I choose to navigate to "Upload a photo of yourself" page for FMR
    And I select continue on upload photo
    Then I should see "There is a problem" error message displayed
    And I should see "Select a file" error summary
    When I choose to upload "yourself1.JPEG" file
    And I choose to upload another "yourself.png" file
    Then I should see "There is a problem" error message displayed
    And I should see "You have already uploaded a photo, remove it to upload a new one" error summary
    When I choose to upload "yourself20Mb.pdf" file
    Then I should see "Your photo must be smaller than 20MB" error for max upload file
    When I choose to upload "text.txt" file
    Then I should see "Your photo must be a JPG, PNG, GIF, JPEG or PDF file" error for type of uploaded file

  Scenario: FMR - Validation error message for Is there anything else you can tell us that may help us find your record? and How would you like us to contact you pages
    Given I visit the Find my reference page
    When I choose to navigate to "Is there anything else you can tell us that may help us find your record?" page for FMR
    And I enter "501" characters in "Is there anything else you can tell us that may help us find your record?" page for FMR
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "You have exceeded the 500 character limit" error summary
    When I enter "500" characters in "Is there anything else you can tell us that may help us find your record?" page for FMR
    And I select continue
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select how you want to be contacted" error summary
    When I complete the fields below with How would you like us to contact you via email details:
      | Radio Option | Email |
      | Email Value  |       |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address" error summary
    When I complete the fields below with How would you like us to contact you via email details:
      | Radio Option | Email     |
      | Email Value  | @test.com |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
    When I complete the fields below with How would you like us to contact you via uk address details:
      | Radio Option   | UK address |
      | Address line 1 |            |
      | Address line 2 |            |
      | Town or City   |            |
      | Country        |            |
      | Postcode       |            |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter address line 1, typically your building and street¬Enter your town or city¬Enter your postcode" error summary
    When I complete the fields below with How would you like us to contact you via uk address details:
      | Radio Option   | UK address |
      | Address line 1 | 12         |
      | Address line 2 | Kings      |
      | Town or City   | Leeds      |
      | Country        | UK         |
      | Postcode       | L!2 1PP    |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter a valid UK postcode" error summary

  Scenario: FMR - Validation error message for Are you completing this form on behalf of someone else page
    Given I visit the Find my reference page
    When I choose to navigate to "Are you completing this form on behalf of someone else?" page for FMR
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Select if you are completing this form on behalf of someone else" error summary
    When I answer "Yes" on "Are you completing this form on behalf of someone else?" page for FMR and choose to continue
    And I select continue
    Then I should see "There is a problem" error message displayed
    And I should see "Enter your full name¬Enter your email address¬Select which type of support you are to the requestor" error summary
    When I complete the fields below with What are your details:
      | Radio Option    | Yes            |
      | Full name       | 1Full name     |
      | Email address   | Kings@test.com |
      | Type of support | Sponsor        |
    Then I should see "There is a problem" error message displayed
    And I should see "Full name must only include letters a to z, spaces, hyphens and apostrophes" error summary
    When I complete the fields below with What are your details:
      | Radio Option    | Yes       |
      | Full name       | Full name |
      | Email address   | Kings.com |
      | Type of support | Sponsor   |
    Then I should see "There is a problem" error message displayed
    And I should see "Enter an email address in the correct format, like name@example.com" error summary
