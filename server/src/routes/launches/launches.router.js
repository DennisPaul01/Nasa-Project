const express = require("express");

const {
  httpGetAllLaunches,
  httpAddNewLunch,
  httpAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
