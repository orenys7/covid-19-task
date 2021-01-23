const express = require("express");
const eventsRouter = require("./events.router");

const app = express();
app.use("/events", eventsRouter);

module.exports = app;
