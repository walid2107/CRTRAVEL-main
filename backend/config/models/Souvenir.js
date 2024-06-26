const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const souvenirSchema = new Schema({
    id: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    imageUrl: { type: String, required: true },
    comment: { type: String, required: true },
    reports: { type: Number, required: true }
  });
  
  const Souvenir = mongoose.model('Souvenir', souvenirSchema);
  module.exports = Souvenir;
  