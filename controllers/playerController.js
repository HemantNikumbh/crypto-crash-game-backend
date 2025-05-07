const Player = require("../models/Player");
const cryptoPrices = require("../utils/priceCache");

exports.getWallet = async (req, res) => {
  const player = await Player.findOne({ id: req.params.playerId });
  if (!player) return res.status(404).send("Player not found");
  const wallet = player.wallet;
  const usdBalance = {
    BTC: wallet.BTC * cryptoPrices.get("BTC"),
    ETH: wallet.ETH * cryptoPrices.get("ETH"),
  };
  res.send({ wallet, usdBalance });
};