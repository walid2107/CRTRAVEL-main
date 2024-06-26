const verifyToken=require('../verifyToken');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Trip=require('../../models/Trip');
const Reservation = require('../../models/Reservation');
const Service=require('../../models/ServiceSchema');
const Activitie=require('../../models/ActivitySchema');

const router = express.Router();

//Trip validator for create trip route
const createReservationValidation= [
    body('numberOfSeats').isInt({ gt: 0 }).withMessage('Number of seats must be a positive integer'),
    body('additionalServices').isArray().withMessage('Services must be an array'),
    body('additionalServices.*.name').notEmpty().withMessage('Service name is required'),
    body('additionalServices.*.price').isFloat({ gt: 0 }).withMessage('Service price must be a positive number'),
    body('additionalServices.*.duration').isFloat({ gt: 0 }).withMessage('Service duration must be a positive number'),
    body('additionalActivities').isArray().withMessage('Activities must be an array'),
    body('additionalActivities.*.name').notEmpty().withMessage('Activity name is required'),
    body('additionalActivities.*.price').isFloat({ gt: 0 }).withMessage('Activity price must be a positive number'),
    body('additionalActivities.*.duration').isFloat({ gt: 0 }).withMessage('Activity duration must be a positive number')
];


// @route    POST /api/reservations/create
// @desc     Create a new reservation
//@access    Private
router.post('/create',verifyToken,createReservationValidation, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user,trip ,numberOfSeats,additionalServices,additionalActivities } = req.body;

        let servicesAmount=0;
        let activitiesAmount=0;
        let finalAmount=0;
        
        additionalServices.forEach(async serviceID => {
            let service=await Service.findById(serviceID);
            servicesAmount+=service.price;
        });

        additionalActivities.forEach(async activitieID => {
            let activitie=await Activitie.findById(activitieID);
            activitiesAmount+=activitie.price;
        });

        const tripOBJ = await Trip.findOne({_id: trip });
        console.log(tripOBJ);
        if (!tripOBJ) {
            return res.status(404).json({ error: 'This trip is no more available or deleted !' });
         }
        finalAmount = ((tripOBJ.basePrice.price)*numberOfSeats) + servicesAmount + activitiesAmount;

        try {
            const reservation = new Reservation({
                user,
                trip,
                numberOfSeats,
                finalAmount,
                additionalServices,
                additionalActivities,
            });
            await reservation.save();
            res.status(201).json(reservation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// @route    POST /api/reservations/get/tripowner/trip
// @desc     Get reservations for the organiser
//@access    Private

router.get('/get/tripowner/trip',verifyToken,async (req, res) => {
    try {
        const userId = req.user._id;
    
        const reservations = await Reservation.find().populate({ path: 'trip',match: { postOwner: userId }});
  
        if (reservations.length === 0) {
          return res.status(404).json({ message: 'No reservations found.' });
        }
    
        res.json(reservations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


// @route    POST /api/reservations/get/tripowner/trip/:id
// @desc     Get reservations by trip for the trip owner
//@access    Private

router.get('/get/tripowner/trip/:id',verifyToken,async (req, res) => {
    try {
        const userId = req.user._id;
    
        const reservation = await Reservation.findOne({_id:req.params.id}).populate({ path: 'trip',match: { postOwner: userId}});
  
        if (reservation.length === 0) {
          return res.status(404).json({ message: 'No reservations found for this trip.' });
        }
    
        res.json(reservation);

      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


// @route    POST /api/trips/confirm/:id
// @desc      Confirm a trip by ID
//@access    Private
router.put('/confirm/:id',verifyToken,async (req, res) => {
    try {
        const userId = req.user._id;
    
        const reservation = await Reservation.findOne({_id:req.params.id}).populate({ path: 'trip',match: { postOwner: userId}});
  
        if (reservation.length === 0) {
          return res.status(404).json({ message: 'This reservation is no more available.' });
        }
        reservation.confirmed=true;
        reservation.save();
        res.json(reservation);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route    POST /api/reservations/get/tripowner/trip/:id
// @desc     Get reservations by trip for the trip owner
//@access    Private

router.get('/get/tripowner/trip/:id',verifyToken,async (req, res) => {
    try {
        const userId = req.user._id;
    
        const reservation = await Reservation.findOne({_id:req.params.id}).populate({ path: 'trip',match: { postOwner: userId}});
  
        if (reservation.length === 0) {
          return res.status(404).json({ message: 'No reservations found for this trip.' });
        }
    
        res.json(reservation);

      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


// @route    POST /api/trips/confirm/:id
// @desc      Confirm a trip by ID
//@access    Private
router.put('/paymentMade/:id',verifyToken,async (req, res) => {
    try {
        const userId = req.user._id;
    
        const reservation = await Reservation.findOne({_id:req.params.id}).populate({ path: 'trip',match: { postOwner: userId}});
  
        if (reservation.length === 0) {
          return res.status(404).json({ message: 'This reservation is no more available.' });
        }
        reservation.paymentMade=true;
        reservation.save();
        res.json(reservation);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/*

// @route    POST /api/trips/update/:id
// @desc      update a trip
//@access    Private
router.put( '/update/:id',updateTripValidation,verifyToken,async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('services').populate('activities');
            if (!trip) {
                return res.status(404).json({ error: 'Trip not found' });
            }
            res.json(trip);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// @route    POST /api/trips/delete/:id
// @desc     Delete a trip by id
//@access    Private
router.delete('/delete/:id', verifyToken,async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
*/
module.exports = router;
