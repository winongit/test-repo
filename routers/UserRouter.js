const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkEmail,
  uploadPhoto,
} = require("../controllers/UserController");
const multer = require("multer");
const path = require("path");
const { fileFilterFunc } = require("../common/UploadPhotosConfig");
const upload = require("../common/CloudUpload");

router.post("/auth/signUp", register);
router.post("/auth/signIn", login);
router.get("/checkEmail", checkEmail);
router.post("/upload", upload.single("picture"), function (req, res, next) {
  res.status(200).send({ file: process.env.AZURE_FILE_PATH + req.filename });
});

module.exports = router;
