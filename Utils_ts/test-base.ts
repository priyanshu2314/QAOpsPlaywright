import { test as baseTest } from "@playwright/test";
interface TestDataForOrder {
  username: string;
  password: string;
  productName: string;
}
export const customTest = baseTest.extend<{
  testDataForOrder: TestDataForOrder;
}>({
  testDataForOrder: {
    username: "priyanshujha@gmail.com",
    password: "Prj2314@",
    productName: "ZARA COAT 3",
  },
});
