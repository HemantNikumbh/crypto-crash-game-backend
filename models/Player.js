const mongoose = require("mongoose");
module.exports = mongoose.model("Player", new mongoose.Schema({
  id: String,
  wallet: {
    BTC: Number,
    ETH: Number,
  },
}));