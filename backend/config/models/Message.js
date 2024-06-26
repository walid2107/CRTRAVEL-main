const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: { type: Number, required: true },
  discussion: { type: Schema.Types.ObjectId, ref: 'Discussion', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageType: { type: String, required: true },
  content: { type: String, required: true },
  sentDate: { type: Date, required: true }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
