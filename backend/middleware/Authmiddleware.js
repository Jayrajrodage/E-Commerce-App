const JWT = require("jsonwebtoken");
const userModel = require("../models/UserModel.js");
const requireSignIn = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(411).send({
        success: false,
        message: "Please Login or sign up first",
      });
    }
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    if (!decode) {
      res.status(411).send({
        success: false,
        message: "JWT Token is wrong",
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    let id = String(req.user.id);
    console.log("Type of id:", typeof id);
    const user = await userModel.findById(req.user.id);

    if (user.role !== 1) {
      return res.status(200).json({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

module.exports = { requireSignIn, isAdmin };
