require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true, // Allow cookies and other credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  })
);

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes (login/register)
app.use('/api', userRoutes); // User-related routes (CRUD operations)

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
