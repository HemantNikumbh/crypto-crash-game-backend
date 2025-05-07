const Round = require("../models/Round");
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const cryptoUtils = require("../utils/cryptoUtils");
const cryptoPrices = require("../utils/priceCache");

let currentRound = null;

exports.startNewRound = (io) => {
  const round_id = cryptoUtils.uuid();
  const seed = cryptoUtils.randomSeed();
  const crash_point = cryptoUtils.generateCrashPoint(seed, round_id);
  currentRound = { round_id, seed, crash_point, bets: [], cashouts: [], startTime: Date.now() };
  io.emit("round_start", { round_id });

  const start = Date.now();
  const interval = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000;
    const multiplier = 1 + elapsed * 0.05;
    if (multiplier >= crash_point) {
      io.emit("round_crash", { crash_point });
      clearInterval(interval);
      new Round(currentRound).save();
      setTimeout(() => exports.startNewRound(io), 10000);
    } else {
      io.emit("multiplier", { multiplier });
    }
  }, 100);
};

exports.placeBet = async (req, res) => {
  const { playerId, usdAmount, currency } = req.body;
  if (!playerId || usdAmount <= 0 || !["BTC", "ETH"].includes(currency)) return res.status(400).send("Invalid input");
  const player = await Player.findOne({ id: playerId });
  if (!player) return res.status(404).send("Player not found");
  const price = cryptoPrices.get(currency);
  const cryptoAmount = usdAmount / price;
  if (player.wallet[currency] < cryptoAmount) return res.status(400).send("Insufficient balance");
  player.wallet[currency] -= cryptoAmount;
  await player.save();
  await Transaction.create({ player_id: playerId, usd_amount: usdAmount, crypto_amount: cryptoAmount, currency, transaction_type: "bet", transaction_hash: cryptoUtils.uuid(), price_at_time: price, timestamp: new Date() });
  currentRound.bets.push({ playerId, usdAmount, cryptoAmount, currency });
  res.send({ success: true });
};

exports.cashout = async (req, res) => {
  const { playerId } = req.body;
  const player = await Player.findOne({ id: playerId });
  if (!player) return res.status(404).send("Player not found");
  const bet = currentRound.bets.find(b => b.playerId === playerId);
  if (!bet || currentRound.cashouts.find(c => c.playerId === playerId)) return res.status(400).send("Invalid cashout");
  const elapsed = (Date.now() - currentRound.startTime) / 1000;
  const multiplier = 1 + elapsed * 0.05;
  if (multiplier >= currentRound.crash_point) return res.status(400).send("Crashed");
  const payoutCrypto = bet.cryptoAmount * multiplier;
  const payoutUsd = payoutCrypto * cryptoPrices.get(bet.currency);
  player.wallet[bet.currency] += payoutCrypto;
  await player.save();
  await Transaction.create({ player_id: playerId, usd_amount: payoutUsd, crypto_amount: payoutCrypto, currency: bet.currency, transaction_type: "cashout", transaction_hash: cryptoUtils.uuid(), price_at_time: cryptoPrices.get(bet.currency), timestamp: new Date() });
  currentRound.cashouts.push({ playerId, payoutCrypto, payoutUsd });
  res.send({ success: true });
};

exports.getCurrentRound = () => currentRound;
