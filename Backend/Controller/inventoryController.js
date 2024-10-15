const User = require('../Models/User.js');
const  asyncHandler  = require('express-async-handler') ;
const  Inventory  = require("../Models/Invenrtory.js");

const getAllUser = asyncHandler(async (req , res) => {
    
    //{ password: 0, cpassword: 0 }: This is the projection.
// password: 0 and cpassword: 0 means to exclude the password and cpassword fields from the result set.
// In MongoDB, setting a field to 0 in a projection tells MongoDB not to return that field in the result.
    const users = await User.find({},{password:0}).lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

const getStore = asyncHandler(async (req , res) => {
    const storeType  = req.params.storeType

    if (!storeType) {
        return res.status(400).json({ message: 'Store Type Required' })
    }

    const store = await Inventory.find({storeType}).lean()

    // If no users 
    if (!store) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(store)
})

const getInventory = asyncHandler(async (req , res) => {
    const inventoryId = req.params.inventoryId
    if (!inventoryId) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const inventory = await Inventory.findOne({inventoryId}).lean()

   
    if (!inventory) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(inventory)
})


const addInventory = asyncHandler(async (req , res) => {

    const {name , storeType , qty , single_price} = req.body

    // creating userObject
    const inventoryObject = {name , storeType , qty , single_price }

    // Create and store new user 
    const inventory = await new Inventory(inventoryObject).save()

    if (inventory) { //created 
        return res.status(201).json({ message: `New inventory added in ${storeType}` })
    } else {
        return res.status(400).json({ message: 'Invalid inventory data received' })
    }

})

const updateInventory = asyncHandler(async (req, res) => {
    var {name , storeType , qty , usedqty ,single_price  } = req.body
    const inventoryId = req.params.inventoryId;
    // console.log(inventoryId);
    // creating userObject

    const inventory = await Inventory.findOne({inventoryId})
    // console.log(inventory);
    if(!inventory)
    {
        return res.status(400).json({ message: 'No inventory found' })
    }
    const sub_total = qty* single_price
    usedqty = inventory.usedqty + usedqty
    const remainqty = qty - usedqty

    const inventoryObject = {name , storeType , qty ,usedqty, remainqty, single_price , sub_total }

    // Create and store new user 
    const updatedInventory = await Inventory.findOneAndUpdate(
        { inventoryId }, 
        inventoryObject,
        { new: true } // Return the updated document
    );
    

    if (updatedInventory) { //created 
        return res.status(201).json({ message: `Inventory updated` })
    } else {
        return res.status(400).json({ message: 'Invalid inventory data received' })
    }
})


const deleteInventory = asyncHandler(async (req, res) => {
    const inventoryId = req.params.inventoryId;
    console.log(inventoryId);
    // creating userObject

    const inventory = await Inventory.findOne({inventoryId})
    // console.log(inventory);
    if(!inventory)
    {
        return res.status(400).json({ message: 'No inventory found' })
    }

    // Create and store new user 
    const inventoryDelete = await Inventory.deleteOne({inventoryId})
    

    if (inventoryDelete) { //created 
        return res.status(201).json({ message: `Inventory deleted` })
    } else {
        return res.status(400).json({ message: 'Invalid inventory data received' })
    }
})


module.exports = {addInventory,updateInventory,deleteInventory,getAllUser,getInventory,getStore};



// .lean():
// lean() is a Mongoose method that tells Mongoose to return 
// plain JavaScript objects instead of Mongoose documents.
// Mongoose documents are rich objects that come with many 
// built-in methods like .save() or .validate(). However, 
// they are slower and heavier.
// Using lean() improves performance because it returns 
// lighter objects without the overhead of Mongoose’s 
// document methods. This is especially useful for read-only operations where you don’t need to modify or save the returned objects.

