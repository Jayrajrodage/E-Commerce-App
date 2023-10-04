const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB databse ${connect.connection.host}`);
  } catch (e) {
    console.log(`Error in MangoDB ${e}`);
  }
};

module.exports = ConnectDB;
