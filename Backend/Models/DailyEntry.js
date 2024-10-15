const mongoose = require('mongoose');
const validator = require('validator');


const entrySchema = new mongoose.Schema({
    userId : {
        type : Number,
        required : [true , 'Please enter user id']
    },
    attendance : [
        {
            date : {
                type : Date,
                required : true
            },
            menu : {
                "breakfast":{
                    type : Boolean,
                    required : true,
                    default: false
                },
                "lunch":{
                    type : Boolean,
                    required : true,
                    default: false
                },
                "dinner":{
                    type : Boolean,
                    required : true,
                    default: false
                },
            }
        }
    ],
},
{timestamps : true}
)


const DailyEntry = mongoose.model('dailyentry' , entrySchema)

module.exports = DailyEntry;