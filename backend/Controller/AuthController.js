const { hashPassword } = require("../helper/AuthHelper.js");
const { comparePassword } = require("../helper/AuthHelper.js");
const userModel = require("../models/UserModel.js");
const orderModel = require("../models/OrderModel.js");
const { z } = require("zod");
const JWT = require("jsonwebtoken");
const RegisterSchema = z.object({
  name: z.string().max(30, { message: "Name must be less than 30 characters" }),
  email: z
    .string()
    .email()
    .max(30, { message: "Email must be less than 30 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be Greater than 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" }),
  phone: z
    .string()
    .max(16, { message: "Phone number must be less than 16 characters" }),
  address: z
    .string()
    .max(100, { message: "address must be less than 100 characters" }),
  answer: z
    .string()
    .max(50, { message: "answer must be less than 100 characters" }),
});
const RegisterController = async (req, res) => {
  try {
    const parsedData = RegisterSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errormessages = parsedData.error.issues.map((obj) => obj.message);
      return res.status(200).send({ message: errormessages });
    }
    let name = parsedData.data.name;
    let email = parsedData.data.email;
    let password = parsedData.data.password;
    let phone = parsedData.data.phone;
    let address = parsedData.data.address;
    let answer = parsedData.data.answer;
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .max(30, { message: "Email must be less than 30 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be Greater than 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" }),
});
const LoginController = async (req, res) => {
  try {
    const parsedData = LoginSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errormessages = parsedData.error.issues.map((obj) => obj.message);
      return res.status(200).send({ message: errormessages });
    }
    let email = parsedData.data.email;
    let Encryptedpassword = parsedData.data.password;
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    let match = await comparePassword(Encryptedpassword, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
        password: Encryptedpassword,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .max(30, { message: "Email must be less than 30 characters" }),
  answer: z
    .string()
    .max(50, { message: "answer must be less than 100 characters" }),
  Newpassword: z
    .string()
    .min(6, { message: "Password must be Greater than 6 characters" })
    .max(20, { message: "Password must be less than 20 characters" }),
});
const forgotPasswordController = async (req, res) => {
  try {
    const parsedData = forgotPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errormessages = parsedData.error.issues.map((obj) => obj.message);
      return res.status(200).send({ message: errormessages });
    }
    let email = parsedData.data.email;
    let answer = parsedData.data.answer;
    let Newpassword = parsedData.data.Newpassword;
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "Wrong Email or Answer" });
    }
    const hashed = await hashPassword(Newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Somthing Went wrong",
      error,
    });
  }
};

// const updateProfileSchema = z.object({
//   name: z.string().max(30, { message: "Name must be less than 30 characters" }),
//   email: z
//     .string()
//     .email()
//     .max(30, { message: "Email must be less than 30 characters" }),
//   password: z
//     .string()
//     .min(6, { message: "Password must be Greater than 6 characters" })
//     .max(20, { message: "Password must be less than 20 characters" }),
//   phone: z
//     .string()
//     .max(16, { message: "Phone number must be less than 16 characters" }),
//   address: z
//     .string()
//     .max(100, { message: "address must be less than 100 characters" }),
// });

const updateProfileController = async (req, res) => {
  try {
    // const parsedData = updateProfileSchema.safeParse(req.body);
    // if (!parsedData.success) {
    //   const errormessages = parsedData.error.issues.map((obj) => obj.message);
    //   return res.status(200).send({ message: errormessages });
    // }
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findOne({ email });
    const hashedPassword = await hashPassword(password);
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        address: address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
      password,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user.id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const Dummy = async (req, res) => {
  res.send({ message: "Route accessed" });
};
module.exports = {
  RegisterController,
  LoginController,
  Dummy,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  orderStatusController,
  getAllOrdersController,
};
