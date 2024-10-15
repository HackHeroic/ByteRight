const {Router}  = require('express');
const {addPlan,deletePlan,getAllPlan,getPlan,updatePlan} = require('../Controller/planController');

const planRoute = Router();

// router queries
planRoute.get("/getPlan/:plan_type" ,  getPlan)
planRoute.get("/getAllPlan" ,  getAllPlan)
planRoute.post("/addPlan" , addPlan)
planRoute.patch("/updatePlan" , updatePlan)
planRoute.delete("/deletePlan" , deletePlan)

// exporting router application
module.exports = planRoute;