const mongoose = require("mongoose");
const userProduct = new mongoose.Schema({
  uid: String,
  ImageId: String,
  imageLink: String,
});

module.exports = new mongoose.model("UserProduct", userProduct);
