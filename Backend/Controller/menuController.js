const  Menu  = require("../Models/Menu") ;
const  asyncHandler  = require('express-async-handler');


const getMenu = asyncHandler(async (req , res) => {
    const menu_day = req.params.menu_day
    // console.log(menu_day);
    // Confirm data
    if (!menu_day) {
        return res.status(400).json({ message: 'Menu Day Require' })
    }

    const menu = await Menu.find({menu_day}).lean()
    // console.log(menu);
    // If no users 
    if (!menu) {
        return res.status(400).json({ message: 'No menu found' })
    }

    res.json({menu , message:"Your menu on screen"})
})


const addMenu = asyncHandler(async (req , res) => {

    // read data from req body
    const {menu_day , menu_breakfast , menu_lunch , menu_dinner , special_menu,menu_snacks} = req.body
    if (!menu_day) {
        return res.status(400).json({ message: 'Menu Day Require' })
    }

    if(menu_breakfast.length===0 && menu_lunch.length===0 && menu_dinner.length===0)
    {
        const result = await Menu.deleteOne({menu_day})
        const reply = `Menu of ${menu_day} deleted`
        return res.json({message:"Menu deleted successfully"})
    }
    // duplicate entry than update menu
    const duplicate = await Menu.findOne({menu_day}).lean().exec()
    if (duplicate) {
        const updatedPlan = await Menu.updateOne({menu_day} , {menu_breakfast,menu_lunch , menu_dinner, special_menu,menu_snacks})
        return res.json({ message: `${menu_day} plan updated` })
    }

    // creating userObject
    const menuObject = {menu_day , menu_breakfast , menu_lunch , menu_dinner , special_menu,menu_snacks}

    // Create and store new user 
    const menu = await new Menu(menuObject).save()

    if (menu) { //created 
        return res.status(201).json({ message: `Your ${menu_day} menu added` })
    } else {
        return res.status(400).json({ message: 'Invalid menu data received' })
    }

})

const updateMenu = asyncHandler(async (req, res) => {
    const {menu_day , menu_breakfast , menu_lunch , menu_dinner , special_menu ,menu_snacks} = req.body

    // Does the plan exist to update?
    const menu = await Menu.find({menu_day}).exec()
    console.log(menu);
    if (!menu) {
        return res.status(400).json({ message: 'Menu not found' })
    }

    const updatedPlan = await Plan.updateOne({menu_day} , {menu_breakfast,menu_lunch , menu_dinner, special_menu,menu_snacks})
    const updatedMenu = await Menu.updateOne({menu_day} , {menu_breakfast,menu_lunch , menu_dinner, special_menu,menu_snacks})
    res.json({ message: `${menu_day} plan updated` })
})

const deleteMenu = asyncHandler(async (req, res) => {
    const { menu_day } = req.body

    // Confirm data
    if (!menu_day) {
        return res.status(400).json({ message: 'Menu Day Required' })
    }

    // Does the user exist to delete?
    const menu = await Menu.find({menu_day}).exec()

    if (!menu) {
        return res.status(400).json({ message: 'Menu not found' })
    }

    const result = await Menu.deleteOne({plan_type})

    const reply = `Menu of ${menu_day} deleted`

    res.json(reply)
})

module.exports = {addMenu,getMenu,updateMenu,deleteMenu};