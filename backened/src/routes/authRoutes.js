// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginController");
const { createUser, getUserById } = require("../controllers/signupController");
const { getProfile } = require("../controllers/getProfileController");
const verifyToken = require("../middlewares/middleWares");

const {
  getAllFoods,
  createFood,
  getFoodById,
  updateFoodById,
  deleteFoodById,
} = require("../controllers/foodController");
const {
  getAllOrders,
  createOrder,
  updateOrderById,
} = require("../controllers/orderController");
const {
  getAllWorkTrack,
  createWorkTrack,
  updateWorkTrackById,
} = require("../controllers/workTrackingController");
const { getAllUsers, updateUser, deleteUserById } = require("../controllers/usersController");

//pre login routes
router.post("/login", login);
router.post("/signup", createUser);
router.get("/user/:id", getUserById);
router.get("/profile/:id", getProfile);

//my order routes
router.route("/users").get(verifyToken, getAllUsers);
router.route("/users/:id").put(verifyToken, updateUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUserById);
router
  .route("/foods")
  .get(verifyToken, getAllFoods)
  .post(verifyToken, createFood);
router
  .route("/worktracks")
  .get(verifyToken, getAllWorkTrack)
  .post(verifyToken, createWorkTrack);

router.route("/worktracks/:id").put(verifyToken, updateWorkTrackById);
router
  .route("/foods/:id")
  .get(verifyToken, getFoodById)
  .put(verifyToken, updateFoodById)
  .delete(verifyToken, deleteFoodById);

router
  .route("/orders")
  .get(verifyToken, getAllOrders)
  .post(verifyToken, createOrder);
router.route("/orders/:id").put(verifyToken, updateOrderById);

module.exports = router;
