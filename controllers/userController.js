const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      data: null,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists',
        data: null,
      });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      data: null,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
};
