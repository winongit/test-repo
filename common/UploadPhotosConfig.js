const maxFileSize = 5 * 1024 * 1024;

const fileFilterFunc = (req, file, cb) => {
  const fileSize = parseInt(req.headers["content-length"]);
  console.log("fileSize " + fileSize);
  console.log(typeof file.mimetype);
  console.log(file.mimetype === "image/jpeg");
  if (fileSize >= maxFileSize) {
    cb("bigfilesize", false);
  } else if (
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/png"
  ) {
    cb("invalidfiletype", false);
  } else {
    cb(null, true);
  }
};

module.exports = { fileFilterFunc };
