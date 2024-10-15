const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log(`Welcome to mongoose `);

const connection = async() => {
    console.log('connection starting');

    await mongoose.connect(process.env.DATABASE).then(()=>{
        console.log(`Connection Successful`)
    }).catch((e) => {
        console.log(`Error while connecting to DB : ${e}` );
    })
};

module.exports = {connection};