const User = require('../models/signUpModal');  // Replace with the actual path to your Login model

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the userId is sent as a parameter
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user profile based on the user ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user profile
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
