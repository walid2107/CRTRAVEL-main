const express=require('express');
const {check, validationResult, body} = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const router=express.Router();

const User=require('../../models/User');

//generate token

const generateToken=(user)=>{
    return jwt.sign({_id:user._id,email:user.email,fullName:user.fullName},'SUPERKEYSECRETCRTRAVEL2024');
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
// @desc     Register user
//@access    Public
router.post('/register', registerValidation ,async (req,res)=>{
    //validate register informations
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success:false,errors:errors.array()});
    }
    //check user exist
    const userExist=await User.findOne({email:req.body.email});
    if(userExist){
        return res.status(400).send({success:false,"errors": [
        {
            "type": "field",
            "value": req.body.email,
            "message": "Email already exist !",
            "path": "email",
            "location": "body"
        }]
    })
    }

    //hashing the password
    const salt=await bcrypt.genSalt();
    const hashPassword=await bcrypt.hash(req.body.password,salt);

    const user=new User({
        fullName:req.body.fullName,
        email:req.body.email,
        password:hashPassword,
    });

    try{
        //create and assign a token
        const token=generateToken(user);
        const savedUser=await user.save();
        res.send({success:true,data:{id:savedUser._id,fullName:savedUser.fullName,email:savedUser.email},token});
    }catch(error){
        console.error(error.message);
        res.status(400).send({success:false, errors:[{message:'Server Error'}]});
    }
})

// @route    POST /api/users/login
// @desc     Register user
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
