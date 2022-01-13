const nunjucks = require("nunjucks");

function setUpNunjucks(app) {
  const env = nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  // register custom helper
  env.addFilter("shorten", function (str, count) {
    return str.slice(0, count || 5);
  });
  // ... your other filters here
}

module.exports = setUpNunjucks;
