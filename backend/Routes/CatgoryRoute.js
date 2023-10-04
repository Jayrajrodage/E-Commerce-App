const express = require("express");
const { requireSignIn, isAdmin } = require("../middleware/Authmiddleware");
const {
  createCategoryController,
  updateCategoryController,
  categoryControlller,
  singleCategoryController,
  deleteCategoryCOntroller,
} = require("../Controller/CategoryController");
const Router = express.Router();

//routes

// create category
Router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// //update category
Router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// //getALl category
Router.get("/get-category", categoryControlller);

// //single category
Router.get("/single-category/:slug", singleCategoryController);

// //delete category
Router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

module.exports = Router;
