const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post("/bet", gameController.placeBet);
router.post("/cashout", gameController.cashout);

module.exports = router;