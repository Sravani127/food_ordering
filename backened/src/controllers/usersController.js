const Users = require('../models/signUpModal'); 

const getAllUsers = async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).send({
        status: "Success",
        msg: "retrieved success",
        date: new Date().toLocaleString(),
        data: users,
      });
    } catch (error) {
      res.status(404).send({
        status: "Failed",
        msg: "not found!!",
        err: error,
        date: new Date().toLocaleString(),
      });
    }
  };

  const updateUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await Users.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!user) {
        // If the course with the specified ID doesn't exist, return an error response.
        return res.status(404).send({
          status: "Failed",
          msg: `Restaurant with ID ${id} not found`,
          date: new Date().toLocaleString(),
        });
      }
    
      res.status(200).send({
        status: "Success",
        msg: `Updated ${id} success`,
        date: new Date().toLocaleString(),
        data: {
          user
        },
      });
    } catch (error) {
  
      // Handle validation errors separately if needed.
      if (error.name === "ValidationError") {
        return res.status(400).send({
          status: "Failed",
          msg: "Validation error",
          errors: error.errors,
          date: new Date().toLocaleString(),
        });
      }
  
      res.status(500).send({
        status: "Failed",
        msg: "Internal Server Error",
        date: new Date().toLocaleString(),
      });
    }
  };

  const deleteUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await Users.findByIdAndDelete(id);
  
      if (!deletedUser) {
        // If the course with the specified ID doesn't exist, return an error response.
        return res.status(404).send({
          status: "Failed",
          msg: `Restaurant with ID ${id} not found`,
          date: new Date().toLocaleString(),
        });
      }
  
      res.status(200).send({
        status: "Success",
        msg: `Deleted Restaurant with ID ${id}`,
        date: new Date().toLocaleString(),
        data: {
          course: deletedUser,
        },
      });
    } catch (error) {
      console.error("Error:", error);
  
      res.status(500).send({
        status: "Failed",
        msg: "Internal Server Error",
        date: new Date().toLocaleString(),
      });
    }
  };

  module.exports = {
    getAllUsers,
    updateUser,
    deleteUserById
  };
  