const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

exports.connect = () => {
    mongoose.connect(MONGODB_URI,{
        usenewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        console.log(err.message);
        process.exit(1); // Exit the process with failure
    });
}