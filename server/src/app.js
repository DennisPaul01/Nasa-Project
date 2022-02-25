const express = require("express");

const planetsRouter = require("./routes/planets/plantes.router");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
