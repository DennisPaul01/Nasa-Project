const { planets } = require("../../model/planets.model");

function getAllPlanets(req, res) {
  res.status(200).json(planets);
}

module.exports = { getAllPlanets };
