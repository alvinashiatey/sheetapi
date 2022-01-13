require("dotenv").config();
const { createClient } = require("redis");
let redis = createClient({ url: process.env.REDIS_URL });
redis.on("connect", function (err, response) {
  "use strict";
  console.log("Connected to database");
});
(async function start() {
  await redis.connect();
})();

module.exports = redis;
