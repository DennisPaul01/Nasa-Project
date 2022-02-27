const { getAllPlanets } = require("../../model/planets.model");

function httpGetAllPlanets(req, res) {
  res.status(200).json(getAllPlanets());
}

module.exports = { httpGetAllPlanets };
