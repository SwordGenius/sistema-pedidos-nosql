const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = process.env.MONGO_URI;

console.log(mongoUri)
mongoose.connect(mongoUri)
    .then(()=> console.log("successfully connected to the database"))
    .catch(e=>console.log(e))

