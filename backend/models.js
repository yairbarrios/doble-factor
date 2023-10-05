const mongoose = require("mongoose");

const PlayerModelSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    score: Number,
    suscribed: Boolean,
    email: String,
    fecha: Date,
    token: Number
});

module.exports = {
  PlayerModel: mongoose.model("player", PlayerModelSchema),
};