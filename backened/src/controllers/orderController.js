const Order = require("../models/orderModal");

const getAllOrders = async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).send({
      status: "Success",
      msg: "retrieved success",
      date: new Date().toLocaleString(),
      data: Orders,
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

const createOrder = async (req, res) => {

  try {
    const Orders = await Order.create(req.body);
    res.status(201).send({
      status: "Success",
      msg: "inserted success",
      date: new Date().toLocaleString(),
      data: Orders,
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

// const getFoodById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const food = await Food.findById(id);
//     res.status(200).send({
//       status: "Success",
//       msg: `retrieved ${id} success`,
//       date: new Date().toLocaleString(),
//       data: {
//         food,
//       },
//     });
//   } catch (error) {
//     res.status(404).send({
//       status: "Failed",
//       msg: `not found ${id}`,
//       err: error,
//       date: new Date().toLocaleString(),
//     });
//   }
// };

const updateOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
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
        order
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

// const deleteFoodById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedFood = await Food.findByIdAndDelete(id);

//     if (!deletedFood) {
//       // If the course with the specified ID doesn't exist, return an error response.
//       return res.status(404).send({
//         status: "Failed",
//         msg: `Restaurant with ID ${id} not found`,
//         date: new Date().toLocaleString(),
//       });
//     }

//     res.status(200).send({
//       status: "Success",
//       msg: `Deleted Restaurant with ID ${id}`,
//       date: new Date().toLocaleString(),
//       data: {
//         course: deletedFood,
//       },
//     });
//   } catch (error) {
//     console.error("Error:", error);

//     res.status(500).send({
//       status: "Failed",
//       msg: "Internal Server Error",
//       date: new Date().toLocaleString(),
//     });
//   }
// };

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderById,
};
