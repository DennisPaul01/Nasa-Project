const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

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
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // upsert operation = (insert + update)
          savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);

        resolve();
      });
  });
}

async function getAllPlanets() {
  // Cum cautam in collectia noastra
  // daca lasam ({}) - se vor intoarece toate obiectele din collectie
  // daca putem un obict : keplerName:"Kepler-62 f"
  // al doilea {} - reprezinta un obiect cu proprietatile din obiect care
  // dorim sa apara sau nu (1 daca dorim / 0 daca nu dormi)

  // o a doua metoda a fi un string cu ce vrem sa includem sau nu
  // ex. "keplerName anotherField"
  // daca vrem sa fie tot dar sa excludem ceva punem - in fata
  // ex. "-keplerName "
  return planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  //.update
  // primul argument : gaseste toate documente care se potrivesc cu keplerName: planet.kepler_name,
  // al doilea argument : daca exista va face doar update cu ce este in al doilea argument
  // al treilea: daca vrem sa fie adaugata numai daca nu exista
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
