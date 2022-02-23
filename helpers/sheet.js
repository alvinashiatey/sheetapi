const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../creds.json");
require("dotenv").config();

const fetchSpreadsheet = async (sheetDoc, sheetName) => {
  await sheetDoc.useServiceAccountAuth(creds);
  await sheetDoc.loadInfo();
  const sheet =
    sheetName !== null
      ? sheetDoc.sheetsByTitle[sheetName]
      : sheetDoc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  let columns = rows[0]._sheet.headerValues;
  let data = [];
  let rowValues = [];
  for (let rowData of rows) {
    rowValues.push(rowData._rawData)
  }

  let newRowValues = rowValues.map(row => {
    let maxLength = columns.length
    const len = row.length;
    return len < maxLength ? row.concat(Array(maxLength - len).fill('')) : row;
  })

  for (let entry of newRowValues) {
    let row = {};
    for (let [index, value] of entry.entries()) {
      row[columns[index]] = value
    }
    data.push(row);
  }
  return data;
};

module.exports = function (sheetID, sheetName = null) {
  const doc = new GoogleSpreadsheet(sheetID);
  return fetchSpreadsheet(doc, sheetName);
};
