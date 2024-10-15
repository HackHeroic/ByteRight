const User = require('../Models/User') ;
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');

dotenv.config();

const signUp = asyncHandler(async (req, res) => {
    const { name, email, password, mobileno, role } = req.body;
    
    console.log("my role : ",role);
    
    console.log(req.body);
    // || !mobileno || !role
    if (!name || !email || !password  || !mobileno ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        mobileno,
        role,
    });

    await newUser.save();

    res.status(201).json({
        message: "User created successfully",
    });
});


const login = asyncHandler(async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.status(401).json({ message: 'User not available' })
    }

    const matchedPassword = await bcrypt.compare(password,existingUser.password);

    if(!matchedPassword) return res.status(400).json({message:"Unauthorized"});

    const payload = {
        userInfo: {
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            mobileno:existingUser.mobileno
        }
    };

    const secret  = process.env.AUTH_TOKEN;

    const options = {
        expiresIn:'15m'
    }

    const accessToken = jwt.sign(payload,secret,options);

    const refreshToken = jwt.sign({useremail:existingUser.email},secret,{expiresIn:'7d'});

    res.cookie('jwt',refreshToken,{
        // httpOnly:true,
        // secure:true,
        // sameSite:'None',
        maxAge: 7*24*60*60*1000
    })

    // console.log("my refresh token : ",refreshToken); testing if cookie works

    res.json({userId:existingUser.userId,name:existingUser.name,email:existingUser.email,mobileno:existingUser.mobileno,role:existingUser.role,accessToken});

});

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized: No refresh token found' });
    }

    const refreshToken = cookies.jwt;
    const secret = process.env.AUTH_TOKEN;


    jwt.verify(refreshToken, secret, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
        }

        // Find the user using the email decoded from the refresh token
        const existingUser = await User.findOne({ email: decoded.useremail });

        if (!existingUser) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Prepare the payload for a new access token
        const payload = {
            userInfo: {
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                mobileno: existingUser.mobileno,
            },
        };

        const options = { expiresIn: '15m' };

        // Generate a new access token
        const accessToken = jwt.sign(payload, secret, options);

        // Send the new access token as the response
        res.json({userId:existingUser.userId,name:existingUser.name,email:existingUser.email,mobileno:existingUser.mobileno,role:existingUser.role,accessToken});
    });
});

const logout = (req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Logout Successfully' })
}


module.exports = {signUp,login,refresh,logout};