const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/token-check", userController.tokenCheck);
router.post("/token-check-no-data", userController.tokenCheckNoData);
router.post("/login", userController.login);
router.post("/add-user", userController.addUser);
router.get("/get-by-id/:id", userController.getById);

module.exports = router;
