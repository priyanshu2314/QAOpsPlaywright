Feature: Ecommerce validations
  @Validation
  @foo
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed

    Examples:
        | username                |  password |
        | priyanshujha@gmail.com  | Prj2314@  |
        | hello123@gmail.com      | hello123  |