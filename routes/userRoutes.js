const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `image-${Date.now()}.${ext}`);
  },
});

const isImage = (req, file, callback) => {
  file.mimetype.split("/")[0] === "image"
    ? callback(null, true)
    : callback(new Error("only image is allowed..."));
  return true;
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

router.post("/token-check", userController.tokenCheck);
router.post("/token-check-no-data", userController.tokenCheckNoData);
router.post("/login", userController.login);
router.post("/add-user", upload.single("photo"), userController.addUser);
router.get("/get-by-id/:id", userController.getById);

module.exports = router;
