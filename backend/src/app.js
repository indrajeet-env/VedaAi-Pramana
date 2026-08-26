const express = require("express");
const cors = require("cors");

const app = express(); // created the express application

app.use(cors()); // Allow the react frontend to call the backend later on
app.use(express.json()); // allows the backend to parse json req bodies

app.get("/", (req, res) => {
  res.json({
    message: "Vikram-Veda backend is running"
  });
});

module.exports = app;