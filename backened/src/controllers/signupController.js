const User = require("../models/signUpModal");

const createUser = async (req, res) => {
  const {
    mobile_number,
    email,
    password,
    confirm_password,
    first_name,
    last_name,
    admin,
    profileImage,
    role_type,
    salary,
    dob,
  } = req.body;

  try {
    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }] });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const user = new User({
      mobile_number,
      email,
      password,
      first_name,
      last_name,
      admin,
      profileImage,
      role_type,
      salary,
      dob,
      loyalty_points: 0,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
   console.log(error, 'error') 
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).send({
      status: "Success",
      msg: `retrieved ${id} success`,
      date: new Date().toLocaleString(),
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      msg: `not found ${id}`,
      err: error,
      date: new Date().toLocaleString(),
    });
  }
};

module.exports = {
  createUser,
  getUserById,
};
