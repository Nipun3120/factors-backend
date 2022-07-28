var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
  imageLink: String,
});

module.exports = new mongoose.model("Image", imageSchema);
