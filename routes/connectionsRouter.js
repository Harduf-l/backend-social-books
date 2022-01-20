const express = require("express");
const router = express.Router();
const connectionController = require("../controllers/connectionController");

router.post("/connection-status", connectionController.connectionStatus);

router.get(
  "/all-approved-connections/:userId",
  connectionController.allApprovedConnection
);

router.post(
  "/send-connection-request",
  connectionController.sendConnectionRequest
);
router.post(
  "/approve-connection-request",
  connectionController.approveConnectionRequest
);

router.delete(
  "/delete-connection-request",
  connectionController.deleteConnectionRequest
);
module.exports = router;
