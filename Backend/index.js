const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const {connection} = require('./database/db_connect');
const {User} = require('./Models/User');
const authRoute = require('../Backend/Routes/authRoute');
const inventoryRoute = require('../Backend/Routes/inventoryRoutes');
const menuRoute = require('../Backend/Routes/menuRoutes')
const dailyentryRoute = require('../Backend/Routes/dailyentryRoute');
const planRoute = require('../Backend/Routes/planRoute');
dotenv.config(); // Load environment variables
const port = process.env.PORT || 3001;


// create an express app for request-response
const app = express()

// giving all permissions
app.use(express.json())
// app.use(bodyParser.json({extended : true}))
// app.use(bodyParser.urlencoded({extended : true}))
// app.use(cors(corsOptions))
app.use(cookieParser())
app.use("/auth",authRoute);
app.use("/inventory",inventoryRoute);
app.use("/menu",menuRoute);
app.use("/dailyentry",dailyentryRoute);
app.use("/plan",planRoute);

connection();

app.get('/', (req, res) => {
    try {
        res.send("Hello world!!!");
    } catch (ee) {
        console.log(ee.message);
        res.status(400).send(ee);
    }
});

// app.post('/signup', async (req, res) => {
//     try {
//       const newUser = new User(req.body); // Create a new user instance with request data
//       await newUser.save();               // Save user in the database
//       res.status(201).send(newUser);       // Respond with the saved user
//     } catch (error) {
//       res.status(400).send({ error: error.message }); // Respond with an error message
//     }
//   })



app.listen(port, () => {
    console.log(`Server is running on port http://localhost:3000`);
});
