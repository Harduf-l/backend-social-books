const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");

router.get("/get-groups-list", groupsController.getGroupsList);
router.get("/get-single-group-data/:id", groupsController.getSingleGroupData);
// router.get("/get-single-book-data", bookController.getSingleBookData);
module.exports = router;
