const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, mobile, password, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dob || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    // Check if an admin user already exists
    if (userRole === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({ error: 'An admin user already exists. Only one admin is allowed.' });
      }
    }

    // Create and save the user
    const user = new User({
      firstName,
      lastName,
      dob,
      email,
      mobile,
      password,
      role: userRole,
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
    }

    // Handle other errors
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};




// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Create JWT token with user ID and role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send token as a cookie
    res.cookie('token', token, { httpOnly: true });

    // Respond with success message, token, and user role
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      role: user.role, // Return the role ID (or role name)
      userId: user._id  // Optionally, include the user ID
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
