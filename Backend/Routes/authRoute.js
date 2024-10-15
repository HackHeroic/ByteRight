const {Router} = require('express')
const {login,logout,refresh,signUp}  = require('../Controller/authController')
const authrouter = Router()

authrouter.post("/signup",signUp);
authrouter.post("/login" , login)
authrouter.get("/refresh" , refresh)
authrouter.get("/logout" , logout)


// router.route('/logout')
    // .post(authController.logout)

module.exports = authrouter;