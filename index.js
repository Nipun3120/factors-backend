require("dotenv").config();
require("./database/database.config").connect();
const express = require("express");
const http = require("http");
const cors = require("cors");
const users = require("./api/users");
const images = require("./api/images");

// port
const port = process.env.PORT || 3000;

// creating server
const app = express();
const server = http.createServer(app);

// cors
app.use(cors({ origin: "*" }));

// middlewares
app.use(
  express.json({ type: "application/json", limit: "18mb", extended: true })
);
app.use(express.urlencoded({ limit: "18mb", extended: true }));
app.use("/user-images", express.static("user-images"));

// routes
app.use("/users", users);
app.use("/images", images);

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
