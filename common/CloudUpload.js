const multer = require("multer");
var multerAzure = require("multer-azure");
require("dotenv").config();

const fileNameGenerator = (req, file) => {
  req.filename = Date.now() + "_" + file.originalname;
  return req.filename;
};

var upload = multer({
  storage: multerAzure({
    connectionString: process.env.AZURE_CONNECTION_STRING,
    account: process.env.AZURE_ACCOUNT_NAME,
    key: process.env.AZURE_ACCESS_KEY,
    container: process.env.AZURE_CONTAINER,
    blobPathResolver: function (req, file, callback) {
      var blobPath = fileNameGenerator(req, file);
      callback(null, blobPath);
    },
  }),
});

var multerAzure = require("multer-azure");

module.exports = upload;
