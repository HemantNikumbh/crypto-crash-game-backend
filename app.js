const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketHandler = require("./sockets/socketHandler");
const gameRoutes = require("./routes/gameRoutes");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const server = http.createServer(app);

mongoose.connect("mongodb://localhost:27017/crypto-crash", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);

socketHandler(server);

server.listen(3000, () => console.log("Server running on http://localhost:3000"));