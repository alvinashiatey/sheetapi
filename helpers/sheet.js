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
  for (let entry of rows) {
    let row = {};
    for (let column of columns) {
      row[column] = entry[column];
    }
    data.push(row);
  }
  return data;
};

module.exports = function (sheetID, sheetName = null) {
  const doc = new GoogleSpreadsheet(sheetID);
  return fetchSpreadsheet(doc, sheetName);
};
