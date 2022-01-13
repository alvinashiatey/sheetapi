var express = require("express");
var router = express.Router();
const sheets = require("../helpers/sheet");

/* GET home page. */
router.get("/:sheetid", async function (req, res, next) {
  const sheetContent = await sheets(req.params.sheetid);
  res.json({ sheetid: req.params.sheetid, data: sheetContent });
});

module.exports = router;
