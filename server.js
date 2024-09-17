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
  'https://celebrated-jelly-9fcbc4.netlify.app'          // Deployed frontend URL (Replace with your actual deployed frontend URL)
];
// Apply CORS middleware
const corsOptions = {
    origin: (origin, callback) => {
      // If no origin or origin is in the list of allowedOrigins, allow the request
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  app.use(cors(corsOptions));

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
