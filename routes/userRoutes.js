const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/token-check", userController.tokenCheck);
router.post("/token-check-no-data", userController.tokenCheckNoData);
router.post("/login", userController.login);
router.post("/add-user", userController.addUser);
router.post("/update-user-photo", userController.updateUserPhoto);
router.post(
  "/update-user-basic-details",
  userController.updateUserBasicDetails
);
router.get("/get-by-id/:id", userController.getById);
router.get("/wake-up", (req, res) => res.status(200).send("server woke up"));

module.exports = router;
