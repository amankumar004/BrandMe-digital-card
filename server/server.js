const express = require('express');
const cors = require('cors');
const database = require('./config/database');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
database.connect();


// import routes
const authRoutes = require('./routes/authRoute');
const profileRoutes = require('./routes/profileRoute');

// use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);


// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});