const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ReservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        required:true
    },
    numberOfSeats: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    confirmed: {
        type: Boolean,
        default:false
    },
    paymentMade: {
        type: Boolean,
        default: false
    },
    additionalServices: {
        type: [Schema.Types.ObjectId],
        ref: 'Service',
        default: []
    },
    additionalActivities: {
        type: [Schema.Types.ObjectId],
        ref: 'Activity',
        default: []
    },
    phoneNumber:{
        type:String,
        required:true
    }

});


module.exports = mongoose.model('Reservation', ReservationSchema);