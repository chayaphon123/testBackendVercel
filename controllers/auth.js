const User = require('../models/User');


//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) =>{
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token,options).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
}

//@desc  Register user
//@route POST /api/v1/auth/register

exports.register = async (req,res,next)=>{
    try{
        const {name,tel_number,email,password,role} = req.body;

        //Create user
        const user = await User.create({
            name,
            tel_number,
            email,
            password,
            role
        });

        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true , token});

        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(400).json({success: false});
        console.log(err.stack);
    }
   
};

//@desc  Login user
//@route POST/api/v1/auth/login

exports.login = async (req,res,next) =>{
    try{

        const {email, password}=req.body;
    
        //Validate email & password
        if(!email || !password) {
            return res.status(400).json({success:false, msg:'Please provide an email and password'});
        }
    
        //check for user
        const user = await User.findOne({email}).select('+password');
    
        if(!user){
            return res.status(400).json({success:false, msg:'Invalid credentials'});
        }
    
        //Check if password matches
        const isMatch = await user.matchPassword(password);
    
        if(!isMatch){
            return res.status(401).json({success:false, msg:'Invalid credentials'});
        }
    
        //Create token
        // const token=user.getSignedJwtToken();
    
        // res.status(200).json({success:true, token});
    
        sendTokenResponse(user,200,res);
    
    } catch(err){
            return res.status(401).json({success:false, msg:'Cannot convert email or password to string'});
    }
};


//At the end of file
//@desc Get current Logged in user
//@route POST/api/v1/auth/me


exports.getMe = async(req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data:user
    });
};

//@desc  Logout user / clear cookie
//@route  GET/api/v1/auth/logout

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Set to expire in 10 seconds
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

