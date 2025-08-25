const express = require("express");
const router = express.Router();
const { getOffers } = require("../controllers/offersController");

router.get("/", getOffers);

module.exports = router;
