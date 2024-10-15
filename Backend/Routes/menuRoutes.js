const {Router} = require('express')
const  { addMenu, deleteMenu, getMenu, updateMenu }  = require("../Controller/menuController");

const menuRoute = Router();

menuRoute.get("/getMenu/:menu_day" ,  getMenu)
menuRoute.post("/addMenu" , addMenu)
menuRoute.patch("/updateMenu" , updateMenu)
menuRoute.delete("/deleteMenu" , deleteMenu)

module.exports = menuRoute;