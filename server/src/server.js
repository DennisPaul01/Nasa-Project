const http = require("http");

const app = require("./app");

const { loadPlanetsData } = require("./model/planets.model");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// loadPlanetsData defapt este un promise in model folder
// cu rolul de ok request sa dea resolve() si in cazul de error sa dea reject()

// startServer are rolul de a cere datele din server
// 1.inainte ca acesta sa intre un functiun pt user
// 2. si sa incarce serverul

// NODE PATERN
async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
