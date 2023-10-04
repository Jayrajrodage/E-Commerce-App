const express = require("express");
const {
  RegisterController,
  LoginController,
  Dummy,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} = require("../Controller/AuthController");

const { requireSignIn, isAdmin } = require("../middleware/Authmiddleware.js");
// Router object
const Router = express.Router();

// Register || Post
Router.post("/register", RegisterController);

// Login || Post
Router.post("/login", LoginController);

//protected User route auth
Router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
Router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Forget-pass Route
Router.post("/forgot-password", forgotPasswordController);

//update profile

Router.put("/profile", requireSignIn, updateProfileController);

//orders
Router.get("/orders", requireSignIn, getOrdersController);

//all orders
Router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
Router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//Dummy Route
Router.get("/get", requireSignIn, isAdmin, Dummy);

module.exports = Router;
