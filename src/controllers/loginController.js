const User = require('../models/signUpModal');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Perform validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the user exists by email and password
    const user = await User.findOne({ email , password});

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: email }, "secretKey", { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
