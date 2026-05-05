const { test, expect } = require("@playwright/test");
const ExcelJs = require("exceljs");

async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet("Sheet1");
  const output = await readExcel(worksheet, searchText);
  const cell = worksheet.getCell(
    output.row + change.rowChange,
    output.col + change.colChange,
  );
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}
async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.col = colNumber;
      }
    });
  });
  return output;
}
// writeExcelTest(
//   "Apple",
//   350,
//   { rowChange: 0, colChange: 2 },
//   "C:/Users/priya/Downloads/excelTest.xlsx",
// );
test("Upload download excel validation", async ({ page }) => {
  const textSearch = "Mango";
  const updateValue = 350;
  await page.goto(
    "https://rahulshettyacademy.com/upload-download-test/index.html",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadPromise;
  await download.saveAs("C:/Users/priya/Downloads/download.xlsx");
  await writeExcelTest(
    textSearch,
    350,
    { rowChange: 0, colChange: 2 },
    "C:/Users/priya/Downloads/download.xlsx",
  );
  await page.locator("#fileinput").click();
  await page
    .locator("#fileinput")
    .setInputFiles("C:/Users/priya/Downloads/download.xlsx");
  const textlocator = page.getByText(textSearch);
  const desiredRow = await page.getByRole("row").filter({ has: textlocator });
  await expect(desiredRow.locator("#cell-4-undefined")).toContainText(
    String(updateValue),
  );
});
