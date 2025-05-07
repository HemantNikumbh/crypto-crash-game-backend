const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

exports.generateCrashPoint = (seed, roundId) => {
  const hash = crypto.createHash("sha256").update(seed + roundId).digest("hex");
  const hashNum = parseInt(hash.slice(0, 8), 16);
  const max = 12000;
  return Math.max(1, (hashNum % max) / 100);
};

exports.randomSeed = () => crypto.randomBytes(16).toString("hex");
exports.uuid = () => uuidv4();