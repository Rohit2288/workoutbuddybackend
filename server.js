require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const cors = require('cors'); // Import CORS package

//express app
const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:3000',                // Local development URL
  'https://celebrated-jelly-9fcbc4.netlify.app/login'          // Deployed frontend URL (Replace with your actual deployed frontend URL)
];

// Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from allowed origins or no origin (e.g., Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials (if needed, like cookies or authorization headers)
}));

//middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request made at ${req.method} ${req.url}`);
  next();
});

//routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

//connect to db
mongoose.connect(process.env.MONG_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Connected to db & Server is running on port`, process.env.PORT);
    });
  })
  .catch(err => console.error(err));
