require("dotenv").config();
const { createClient } = require("redis");
let redis = createClient({
  url: process.env.REDIS_URL,
  password:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_PASSWORD
      : undefined,
});
redis.on("connect", function (err, response) {
  "use strict";
  console.log("Connected to database");
});
(async function start() {
  await redis.connect();
})();

module.exports = redis;
