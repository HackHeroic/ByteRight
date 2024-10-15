

const moment = require('moment');
const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');

const inventorySchema = new mongoose.Schema({
    inventoryId : {
        
        type : String,
        // required : [true , 'Please enter user id'],
        default: shortid.generate
    },
    name : {
        type : String,
        required : [true , 'Please enter user id']
    },
    storeType : {
        type : String,
        required : [true , 'Please enter plan id'],
        // enum: ['StoreA' , 'StoreB' ,'StoreC','StoreD','StoreE'],
        enum: ['Vessels' , 'Vegetables' ,'Essentials','Liquid','Miscellaneous'],
    },
    date: {
        type: Date,
        // required : [true , "Please enter an contact number"],
    },
    qty : {
        type : Number
    },
    usedqty : {
        type : Number,
        default:0
    },
    remainqty : {
        type : Number
    },
    single_price:{
        type:Number,
        required:true
    },
    sub_total : { 
        type : Number,
    }
},
{timestamps : true}
)
inventorySchema.pre("save", async function (next) {
    var docs = this;
    const data = await Inventory.find()

        // docs.inventoryId = data.length + 1;

        const today_date = moment().utcOffset("+05:30").startOf('day').toDate()
        docs.date = today_date
        docs.sub_total = docs.qty*docs.single_price;
        docs.remainqty = docs.qty-docs.usedqty;

    next()
  });



const Inventory =  mongoose.model('inventory' , inventorySchema)

module.exports = Inventory;