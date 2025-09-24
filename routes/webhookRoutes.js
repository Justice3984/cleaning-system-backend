const express = require("express");
const { airbnbWebhook } = require("../controllers/webhookController");

const router = express.Router();

// Airbnb simulation webhook
router.post("/airbnb", airbnbWebhook);

module.exports = router;
