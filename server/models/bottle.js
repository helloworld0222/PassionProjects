const mongoose = require('mongoose');

const bottleSchema = new mongoose.Schema({
  messageTitle: String,
  senderName: String,
  recipientName: String,
  recipientEmail: String,
  playlistId: String,
  mementos: Array
});

module.exports = mongoose.model('Bottle', bottleSchema);
