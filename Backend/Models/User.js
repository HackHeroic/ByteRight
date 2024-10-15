const mongoose = require('mongoose');
const validator = require('validator');
const DailyEntry = require('./DailyEntry');


const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        default: 0
    },
    name:{
        type:String,
        required:[true,'Please enter your name']
    },
    email:{
        type:String,
        required:[true,`Please enter an email`],
        unique : [true,'Email already exist'],
        validate:[validator.isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password']
    },
    mobileno: {
        type: Number,
        required : [true , "Please enter an contact number"],
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    role:{
        type:Number,
        enum:[0,1,2],
        required:true
    }


},{timestamps:true});

userSchema.pre("save",async function(next){
    console.log('going to the pre section');

    var docs = this;

    const data = await User.find();

    docs.userId = data.length + 1;

    console.log('after adding : ' , docs.userId);

    if(docs.role == 0){
        const today_date = new Date();
        today_date.setDate(today_date.getDate() - 1);
        const dailyEntryObj = {userId:docs.userId,attendance:[{date:today_date}]}
        const success = await new DailyEntry(dailyEntryObj).save();
        console.log("daily entry success" , success);
    }

    next();

})

const User = mongoose.model('newUser',userSchema);

module.exports = User;
