const { Server } = require("socket.io");
const gameController = require("../controllers/gameController");
const axios = require("axios");

module.exports = (server) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    socket.on("cashout", async ({ playerId }) => {
      try {
        const res = await axios.post("http://localhost:3000/api/game/cashout", { playerId });
        socket.emit("cashout_success", res.data);
      } catch (err) {
        socket.emit("cashout_failed", err.response?.data || "Error");
      }
    });
  });
  gameController.startNewRound(io);
};