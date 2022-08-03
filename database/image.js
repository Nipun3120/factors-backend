const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageLink: String,
  isDeleted: { type: Boolean, default: false },
});

module.exports = new mongoose.model("Image", imageSchema);
