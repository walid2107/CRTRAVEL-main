const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

const User = require('../../models/User');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Generate token
const generateToken = (user, imageUri = null) => {
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        image: imageUri 
    };

    return jwt.sign(payload, 'SUPERKEYSECRETCRTRAVEL2024');
}

//implement controles for user register infomations
const registerValidation=[
    check('fullName')
    .isLength({min:2})
    .withMessage('Your full name is required !')
    .isAlphanumeric()
    .withMessage('Please provide a valid full name ! (use only alphanumerics)')
    .isLength({max:30})
    .withMessage('Full name must be at most 30 characters !')
    ,
    check('email')
    .isEmail()
    .withMessage('Please provide a valid email !'),
    check('password')
    .isLength({min:6,max:30})
    .withMessage('Password must be between 6 and 30 charachters !')
]

//implement controles for user register infomations
const loginValidation=[
    check('email')
    .isEmail()
    .withMessage('Please provide a valid email !'),
    check('password')
    .isLength({min:6,max:30})
    .withMessage('Password must be between 6 and 30 charachters !')
]

// @route    POST /api/users/register
// @desc     Register user with image upload
// @access   Public
router.post('/register', upload.single('image'), registerValidation, async (req, res) => {
    // Validate registration information
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if user already exists
    const { fullName, email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                errors: [{ message: 'Email already exists!' }]
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with image URI if uploaded
        const imageUri = req.file ? `/uploads/${req.file.filename}` : undefined; 
        
        user = new User({
            fullName,
            email,
            password: hashedPassword,
            image: imageUri 
        });

        // Save the user
        await user.save();

        // Generate token with image URI
        const token = generateToken(user, imageUri);

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: imageUri 
            },
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, errors: [{ message: 'Server Error' }] });
    }
});


// @route    POST /api/users/login
// @desc     Login user
//@access    Public
router.post('/login', loginValidation ,async (req,res)=>{

    //login fields validations
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({success:false,errors:errors.array()});
    }

    //Check if email exist
    const user=await User.findOne({email: req.body.email});
    if(!user) return res.status(404).send({ success:false,"errors": [{
        "type": "field",
        "message": "User is not registered !",
        "path": "email",
        "location": "body"
    }]});

    //check if password is correct
    const validPassword= await bcrypt.compare(req.body.password,user.password);

    if(!validPassword){
        return res.status(404).send({success:false,"errors": [{
            "type": "field",
            "message": "Invalid Email or Password ",
            "path": "password",
            "location": "body"
        }]} )
    }

    //create and assign a token
    const token=generateToken(user);
    res.header('auth-token',token).send({success:true,message:'Logged in successfully',token});

})

module.exports=router;
