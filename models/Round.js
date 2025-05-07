const mongoose = require("mongoose");
module.exports = mongoose.model("Round", new mongoose.Schema({
  round_id: String,
  seed: String,
  crash_point: Number,
  bets: Array,
  cashouts: Array,
}));