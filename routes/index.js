var express = require("express");
const redis = require("../db/redis_db");
var router = express.Router();
const sheets = require("../helpers/sheet");

var checkCache = async (req, res, next) => {
  try {
    let cacheKey, sheetID, sheetName;
    if (req.params.sheetName) {
      sheetID = req.params.sheetID;
      sheetName = req.params.sheetName;
      cacheKey = `${sheetID}--${sheetName}`;
    } else {
      sheetID = req.params.sheetID;
      cacheKey = `${req.params.sheetID}`;
    }
    if (await redis.exists(cacheKey)) {
      return res.json({
        sheetID: sheetID,
        sheetName: sheetName || "",
        data: JSON.parse(await redis.get(cacheKey)),
        info: "data from cache",
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log(err.message);
  }
};

/* GET home page. */
router.get("/:sheetID/:sheetName", checkCache, async function (req, res, next) {
  try {
    const { sheetID, sheetName } = req.params;
    const { data } = await sheets(sheetID, sheetName);
    const cacheKey = `${sheetID}--${sheetName}`;
    await redis.set(
      cacheKey,
      JSON.stringify({
        sheetID: sheetID,
        sheetName: sheetName,
        data,
      }),
      {
        EX: 30, // Cache for 30 seconds
      }
    );
    return res.json({
      sheetID: sheetID,
      sheetName: sheetName,
      data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error:
        "Either the sheet Id or Sheet name is incorrect. Please verify both and try again.",
    });
  }
});

router.get("/:sheetID", checkCache, async function (req, res, next) {
  try {
    const { sheetID } = req.params;
    const { data, sheetNames } = await sheets(sheetID);
    const cacheKey = `${sheetID}`;
    await redis.set(
      cacheKey,
      JSON.stringify({
        sheetID: sheetID,
        sheetName: sheetNames,
        data,
      }),
      {
        EX: 30, // Cache for 30 seconds
      }
    );
    return res.json({
      sheetID: sheetID,
      sheetName: sheetNames,
      data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error:
        "The Id submitted was not a valid sheet ID, please verify the Id and try again.",
    });
  }
});

module.exports = router;
