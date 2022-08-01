const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageLink: String,
});

module.exports = new mongoose.model("Image", imageSchema);
