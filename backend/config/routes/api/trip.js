const verifyToken=require('../verifyToken');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Trip = require('../../models/Trip');
const Service=require('../../models/ServiceSchema');
const Activitie=require('../../models/ActivitySchema');
const Reservation = require('../../models/Reservation');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage }).single('image');

// Custom middleware to parse tripDetails
const parseTripDetails = (req, res, next) => {
    if (req.body.tripDetails) {
        try {
            req.body.tripDetails = JSON.parse(req.body.tripDetails);
            req.body.tripDetails.basePrice.price = Number(req.body.tripDetails.basePrice.price);
            req.body.tripDetails.numberOfSeats = Number(req.body.tripDetails.numberOfSeats);
            req.body.tripDetails.activities = req.body.tripDetails.activities.map(activitie=>{return {...activitie,price:Number(activitie.price)}});
            req.body.tripDetails.services = req.body.tripDetails.services.map(service=>{return {...service,price:Number(service.price)}});
            next();
        } catch (error) {
            return res.status(400).json({ error: 'Invalid tripDetails format' });
        }
    } else {
        next();
    }
};

// Trip validator for create trip route
const createTripValidation = [
    body('tripDetails.title').notEmpty().withMessage('Title is required'),
    body('tripDetails.description').notEmpty().withMessage('Description is required'),
    body('tripDetails.destination').notEmpty().withMessage('Destination is required'),
    body('tripDetails.numberOfSeats').isInt({ gt: 0 }).withMessage('Number of seats must be a positive integer'),
    body('tripDetails.itinerary').notEmpty().withMessage('Itinerary is required'),
    body('tripDetails.basePrice.price').isFloat({ gt: 0 }).withMessage('Base price must be a positive number'),
    body('tripDetails.startDate').isISO8601().toDate().withMessage('Start date must be a valid date'),
    body('tripDetails.endDate').isISO8601().toDate().withMessage('End date must be a valid date'),
    body('tripDetails.services').isArray().withMessage('Services must be an array'),
    body('tripDetails.services.*.name').notEmpty().withMessage('Service name is required'),
    body('tripDetails.services.*.price').isFloat({ gt: 0 }).withMessage('Service price must be a positive number'),
    body('tripDetails.activities').isArray().withMessage('Activities must be an array'),
    body('tripDetails.activities.*.name').notEmpty().withMessage('Activity name is required'),
    body('tripDetails.activities.*.price').isFloat({ gt: 0 }).withMessage('Activity price must be a positive number'),
];

//Trip validator for update trip route
const updateTripValidation=[
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('destination').optional().notEmpty().withMessage('Destination is required'),
    body('numberOfSeats').optional().isInt({ gt: 0 }).withMessage('Number of seats must be a positive integer'),
    body('itinerary').optional().notEmpty().withMessage('Itinerary is required'),
    body('basePrice.price').optional().isFloat({ gt: 0 }).withMessage('Base price must be a positive number'),
    body('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
    body('services').isArray().withMessage('Services must be an array'),
    body('services.*.name').notEmpty().withMessage('Service name is required'),
    body('services.*.price').isFloat({ gt: 0 }).withMessage('Service price must be a positive number'),
    body('activities').isArray().withMessage('Activities must be an array'),
    body('activities.*.name').notEmpty().withMessage('Activity name is required'),
    body('activities.*.price').isFloat({ gt: 0 }).withMessage('Activity price must be a positive number'),
];

// @route    POST /api/trips/create
// @desc     Create a new trip
//@access    Private
router.post('/create',verifyToken,upload,parseTripDetails,createTripValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(),success:false });
      } else {
        try {
          const { title, description, destination, numberOfSeats, itinerary, basePrice, startDate, endDate, services, activities } = req.body.tripDetails;
          // Save services and activities
    let servicesArray = [];
    for (let element of services) {
      let service = new Service(element);
      await service.save();
      servicesArray.push(service._id);
    }

    let activitiesArray = [];
    for (let element of activities) {
      let activity = new Activitie(element);
      await activity.save();
      activitiesArray.push(activity._id);
    }

    // Create and save the new trip
    const trip = new Trip({
      postOwner: req.user._id,
      title,
      description,
      destination,
      numberOfSeats,
      availableSeats:numberOfSeats,
      itinerary,
      basePrice,
      startDate,
      endDate,
      services: servicesArray,
      activities: activitiesArray,
      image: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    await trip.save();
    let newTrip = await trip.populate({
      path: 'postOwner',
      select: 'fullName _id'
    });

    res.status(201).json({ trip: newTrip, success: true });


        } catch (error) {
          res.status(500).json({ errors:[{msg: error.message}], success: false });
        }
      } 
  });
  


// @route    POST /api/trips/get/all
// @desc     Get all trips
//@access    Private

router.get('/get/all',verifyToken,async (req, res) => {
    try {
        const trips = await Trip.find().populate('services').populate('activities').populate({
            path: 'postOwner',
            select: 'fullName _id'
        });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route    POST /api/trips/get/:id
// @desc      Get a trip by ID
//@access    Private
router.get('/get/:id',verifyToken,async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('services').populate('activities');
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
            await Reservation.deleteMany({ trip: trip._id});
            trip.activities.forEach((activitieID)=>{
                Activitie.findByIdAndDelete(activitieID);
            });
            trip.services.forEach((serviceID)=>{
                Service.findByIdAndDelete(serviceID);
            });
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
