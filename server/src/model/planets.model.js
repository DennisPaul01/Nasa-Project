const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const habitablePlanets = [];
const pathData = path.join(__dirname, "..", "..", "data", "kepler_data.csv");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] == "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/*
const promise= new Promise((resolve,reject)=>{
  resolve (42) - asta scoate daca e resolve
});

// in caz dde 42 sa se executeceva
promise.then(result (adica 42)=>{

});

const result =await promise;
console.log(result);
*/

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathData)
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
