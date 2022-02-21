const mongoose = require('mongoose');

const { Schema } = mongoose;

const TwitchSchema = new Schema({
  username: { type: String },
  code: { type: String },
  client_id: { type: String },
  client_secret: { type: String },
  updated_at: { type: Date },
  access_token: { type: String },
  refresh_token: { type: String },
}, { versionKey: false });

const TwitchDB = mongoose.model('Twitch', TwitchSchema);

module.exports = TwitchDB;
