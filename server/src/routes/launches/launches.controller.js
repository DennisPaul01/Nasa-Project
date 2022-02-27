const {
  getAllLaunches,
  addNewLunch,
  abortLaunchById,
  existsLaunchWithId,
} = require("../../model/launches.model");

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpAddNewLunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing rq lunch property" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (launch.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({ error: "Invalid date" });
  }
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid date" });
  }
  addNewLunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const abortId = Number(req.params.id);

  if (!existsLaunchWithId(abortId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(abortId);
  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLunch, httpAbortLaunch };
