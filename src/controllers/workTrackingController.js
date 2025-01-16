const WorkTrack = require("../models/workTrackingModal");

const getAllWorkTrack = async (req, res) => {
  try {
    const WorkTracks = await WorkTrack.find();
    res.status(200).send({
      status: "Success",
      msg: "retrieved success",
      date: new Date().toLocaleString(),
      data: WorkTracks,
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

const createWorkTrack = async (req, res) => {

  try {
    const WorkTracks = await WorkTrack.create(req.body);
    res.status(201).send({
      status: "Success",
      msg: "inserted success",
      date: new Date().toLocaleString(),
      data: WorkTracks,
    });
  } catch (error) {
    res.status(400).send({
      status: "Failed",
      msg: "invalid Data passed!!",
      err: error,
      date: new Date().toLocaleString(),
    });
  }
};

const updateWorkTrackById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const WorkTracks = await WorkTrack.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!WorkTracks) {
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
            WorkTrack
        },
      });
    } catch (error) {
      console.error("Error:", error);
  
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

module.exports = {
  getAllWorkTrack,
  createWorkTrack,
  updateWorkTrackById
};
