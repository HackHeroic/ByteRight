
const {Router} = require("express");
const  { getDayMemebr, getMonthlyExpenses, getPlanCount, getWeekProfit }  = require("");




const statisticsRoute = Router();


statisticsRoute.get("/getPlanCount" ,  getPlanCount)
statisticsRoute.get("/getDayMember" ,  getDayMemebr)
statisticsRoute.get("/getWeekProfit" ,  getWeekProfit)
statisticsRoute.get("/getMonthlyExpenses" ,  getMonthlyExpenses)

// exporting router application
export default statisticsRoute;