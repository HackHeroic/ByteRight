const mongoose = require('mongoose');


const planSchema = new mongoose.Schema({
    planId: {
        type: Number,
        default: 500,
      },
    plan_type:{
        type: String,
        enum: ['student' , 'faculty' ,'v-faculty','v-student'],//v for visiting 
        required : true 
    },
    plan_desc : {
        type : String,
        required : [true , 'Please enter subscription description']
    },
    plan_price: {
        type: Number,
        required : [true , "Please enter an number"],
        minimum: 0,
        maximum: 1000000,
    },
},
{timestamps : true}
)

planSchema.pre("save", async function (next) {
    var docs = this;
    // console.log(docs);
    const data = await Plan.find()
    // console.log(data.length);
    if(docs.plan_type==='student')
    {
        docs.planId = 501;
    }
    if(docs.plan_type==='faculty')
    {
        docs.planId = 502;
    }
    if(docs.plan_type==='v-student')
    {
        docs.planId = 503;
    }

    if(docs.plan_type === 'v-faculty'){
        docs.planId = 504;
    }
    // console.log(docs.planId);
    next()
  });





const Plan =  mongoose.model('plan' , planSchema)

module.exports = Plan;