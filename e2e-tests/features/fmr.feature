@FmrRegression
@FmrRegressionCI
Feature: FMR - Find my reference

  Scenario Outline: Find my reference form E2E test
    Given I visit the Find my reference page
    When I fill out the answers to FMR form pertaining to "<FMR Journey Test>" happy path test
    Then I should see "Request sent" page for FMR
    And Finish and return to GOV.UK button is displayed for FMR
    Examples:
      | FMR Journey Test                                                                      |
      | Yes to passport, contact via email and form completed on behalf of someone else       |
      | No to passport contact with email and form completed by themself                      |
      | Yes to passport contact with uk address and form completed on behalf of someone else  |
      | No to passport contact with uk address and form completed by themself                 |
