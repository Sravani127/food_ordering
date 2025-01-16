const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobile_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  role_type: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  salary: {
    type: String,
  },
  dob: {
    type: String,
  },
  loyalty_points: {
    type: String,
  },
  orderTenBonusDate: {
    type: String,
  }
});

const signUpModal = mongoose.model("User", userSchema);

module.exports = signUpModal;
