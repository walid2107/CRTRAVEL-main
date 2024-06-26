const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    stepNumber:{
        type:Number,
        required:true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    completed: {
      type: Boolean,
      default: false
    }
  });

const TripSchema = new Schema({
    postOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    numberOfSeats: {
        type: Number,
    },
    availableSeats: {
        type: Number,
    },
    itinerary: {
        type: [ItinerarySchema],
        required: true
    },
    basePrice: new Schema({
    price:{
        type:Number,
    },
    currency: {
      type: String,
    }})
  ,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    services: {
        type: [Schema.Types.ObjectId],
        ref: 'Service',
    },
    activities: {
        type: [Schema.Types.ObjectId],
        ref: 'Activity',
    },
    image: {
        type: String,
    },
 
});


module.exports = mongoose.model('Trip', TripSchema);
