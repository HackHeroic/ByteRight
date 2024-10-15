const DailyEntry = require('../Models/DailyEntry');
const asyncHandler = require('express-async-handler') ;


const getUserEntryDetail = asyncHandler(async (req , res) => {
    const userId = req.params.userId;

    if(!userId){
        req.status(400).json({message:`UserId is required`});
    }

    const entry = await DailyEntry.findOne({userId});

    res.json(entry);


}) 

const updateDailyEntry = asyncHandler(async(req,res) => {
    const {userId,verifyMeal} = req.body;

    // validate userid and meal ....
    if(!userId || (verifyMeal != "breakfast" && verifyMeal != "lunch" && verifyMeal != "dinner")){
        return res.json({message:`Invalid user id or meal type`});
    }

    //validate if user exists
    const existingUser = await DailyEntry.findOne({userId});

    if(!existingUser){
        return res.json({message:`user does not exists`});
    }

    
    

    // get the attendance of that particular userId;

    const todayAttendance = existingUser.attendance.filter((item) => {
        const date = new Date();
        if(item.date.getDate() === date.getDate() && item.date.getMonth() === date.getMonth() && item.date.getFullYear() === date.getFullYear()){
            return item;
        };
    })

    console.log(`Today Attendance : `,todayAttendance);
    const myLength = todayAttendance.length;

    if(verifyMeal == "breakfast"){
        updatedObject = {breakfast:true,lunch:myLength==0?false:todayAttendance[0].menu.lunch,dinner:myLength==0?false:todayAttendance[0].menu.dinner}
    }

    if(verifyMeal == "lunch"){
        updatedObject = {breakfast:myLength==0?false:todayAttendance[0].menu.breakfast, lunch:true, dinner:myLength==0?false:todayAttendance[0].menu.dinner}
    }

    if(verifyMeal == "dinner"){
        updatedObject = {breakfast:myLength==0?false:todayAttendance[0].menu.breakfast,lunch:myLength==0?false:todayAttendance[0].menu.lunch,dinner:true}
    }



    if(myLength == 1){
        if((verifyMeal == "breakfast" && todayAttendance[0].menu.breakfast) || (verifyMeal == "lunch" && todayAttendance[0].menu.lunch) || (verifyMeal == "dinner" && todayAttendance[0].menu.dinner)){
            return res.status(400).json({message:`Your ${verifyMeal} entry is already added`})
        }


        const updateEntry = await DailyEntry.updateOne({"userId":userId } , {
            $set:{
                "attendance.$[elemX].menu" : updatedObject
            }},
            {
                "arrayFilters" : [{"elemX.date":todayAttendance[0].date}]
            }
        )

        return res.json({message:`Daily entery updated for ${verifyMeal}`})

        
    }else{
        const date = new Date();

        const dailyentryObject = {date,menu:updatedObject}

        const updateEntry = await DailyEntry.updateOne({userId},{
            $push:{
                attendance:dailyentryObject
            }
        })
    }

    return res.json({message:`Daily entery updated for ${verifyMeal}`})

})

module.exports = {getUserEntryDetail,updateDailyEntry};