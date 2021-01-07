const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  stego: {
    type: String,
    required: [true, 'It should have a stego image']
  },
  user: {
    type: String,
    required: [true, 'User id should be there']
  },
  messageCreateDate: Date
});
MessageSchema.index({ user: 1 });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
