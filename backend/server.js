const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const ConnectDB = require("./config/db.js");
const Auth = require("./Routes/AuthRoute.js");
const category = require("./Routes/CatgoryRoute.js");
const product = require("./Routes/ProductRoute.js");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
const path = require("path");
//config env
dotenv.config();

// databse config
ConnectDB();

// middlerware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", Auth);
app.use("/api/v1/category", category);
app.use("/api/v1/product", product);
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.use("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });
app.listen(port, () =>
  console.log(
    `Example app Runnig on ${process.env.DEV_MODE} port ${process.env.PORT}!`
  )
);
