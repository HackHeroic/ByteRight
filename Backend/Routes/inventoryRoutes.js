// importing inventoryRoute from express
const {Router} = require('express')
const {addInventory,deleteInventory,updateInventory,getInventory,getStore} = require('../Controller/inventoryController')



// create inventoryRoute application for taking and providing req and res
const inventoryRoute = Router();

// inventoryRoute queries
// inventoryRoute.get("/getusers" ,  getAllUser)
inventoryRoute.get("/getstore/:storeType" ,  getStore)
inventoryRoute.get("/getinventory/:inventoryId" ,  getInventory)
inventoryRoute.post("/addinventory" , addInventory)
inventoryRoute.patch("/updateinventory/:inventoryId" , updateInventory)
inventoryRoute.delete("/deleteinventory/:inventoryId" , deleteInventory)
// inventoryRoute.patch("/resetpasswd" , resetPassword)
// inventoryRoute.get("/verify" ,  d)

// exporting inventoryRoute application
module.exports = inventoryRoute;