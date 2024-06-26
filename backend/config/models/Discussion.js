const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    id: { type: Number, required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true }
  });
  
  const Discussion = mongoose.model('Discussion', discussionSchema);
  module.exports = Discussion;
  