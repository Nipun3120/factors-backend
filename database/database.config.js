const mongoose = require("mongoose");

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/factors-test-db"
    )
    .then(() => console.info("Connected to database"))
    .catch((err) => {
      console.log("Database Connection failed, exiting now...", "\n", err);
      process.exit(1);
    });
};
