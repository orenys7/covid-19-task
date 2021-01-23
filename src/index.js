const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const apiRouter = require("./events/index");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(logger("dev"));
app.use("/api", apiRouter);
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  return res.status(err.statusCode).json({ message: err.message });
});

const server = app.listen(port, () => {
  console.log("listening on port", port);
});

module.exports = { server };
