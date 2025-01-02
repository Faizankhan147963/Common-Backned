const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, mobile, password, role } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      dob,
      email,
      mobile,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if no role provided
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update User by ID
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, mobile, password, role } = req.body;

    // Hash new password if provided
    const updatedFields = { firstName, lastName, dob, email, mobile, role };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);  // Hash new password if provided
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete User by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
