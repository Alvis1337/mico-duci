const mongoose = require('mongoose');

const { Schema } = mongoose;

const TwitchSchema = new Schema({
  username: { type: Schema.ObjectId, ref: 'User' },
  code: { type: String },
  client_id: { type: String },
  client_secret: { type: String },
  updated_at: { type: Date },
}, { versionKey: false });

const TwitchDB = mongoose.model('Twitch', TwitchSchema);

module.exports = TwitchDB;
