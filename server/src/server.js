const http = require("http");

require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./model/planets.model");
const { loadLaunchesData } = require("./model/launches.model");

const PORT = process.env.PORT || 5000;

// LINK to baza noastra de date creata
const MANGO_URL = process.env.MANGO_URL;

const server = http.createServer(app);

// loadPlanetsData defapt este un promise in model folder
// cu rolul de ok request sa dea resolve() si in cazul de error sa dea reject()

// startServer are rolul de a cere datele din server
// 1.inainte ca acesta sa intre un functiun pt user
// 2. si sa incarce serverul

// NODE PATERN
async function startServer() {
  mongoose.connection.once("open", () => {
    console.log(`MongoDB Conection ready`);
  });

  mongoose.connection.on("error", (error) => {
    console.error(`${error}`);
  });

  // .connect sa ne connectam la baza de date
  // MANGO_URL este link-ul la baza noastra de date
  // folosim await pt ca intoarce o promise
  await mongoose.connect(MANGO_URL);
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
