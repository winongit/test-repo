const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { checkToken } = require("./middlewares/checkToken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();
// mongodb connection

app.get("/", (req, res) => {
  res.send("Hello World");
});
// middlewares

app.listen(3000, () => console.log("Listening on port 3000"));
