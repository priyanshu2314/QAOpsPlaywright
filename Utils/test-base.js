const base = require("@playwright/test");

exports.customtest = base.test.extend({
  testDataForOrder: {
    username: "priyanshujha@gmail.com",
    password: "Prj2314@",
    productName: "ZARA COAT 3",
  },
});
