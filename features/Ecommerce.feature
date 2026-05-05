Feature: Ecommerce validations
  @Regression
  Scenario: Placing the Order
    Given a login to Ecommerce application with "priyanshujha@gmail.com" and "Prj2314@"
    When add "ZARA COAT 3" to Cart 
    Then Verify "ZARA COAT 3" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order is present in the OrderHistory

  @Validation
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed

    Examples:
        | username                |  password |
        | priyanshujha@gmail.com  | Prj2314@  |
        | hello123@gmail.com      | hello123  |