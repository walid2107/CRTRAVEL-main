const express=require('express');
const app=express();
const connectDB = require('./config/db');
//Import Routes 
const authRoutes=require('./config/routes/api/auth');
const tripRoutes=require('./config/routes/api/trip');
const reservationRoutes=require('./config/routes/api/reservation');
//Verfie token module
const verifyToken=require('./config/routes/verifyToken');
const path = require('path');


//connect to database
connectDB();

//initialiser les middlewares
app.use(express.json({extends :false}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//calling routes using middleware
app.use('/api/users',authRoutes);
app.use('/api/trips',tripRoutes);
app.use('/api/reservations',reservationRoutes);


const PORT=process.env.PORT || 5000;

//Serve Static Assets
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT,()=>console.log(`Server started on PORT ${PORT}`));
