//
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Keplex Eploration X",
  rocket: "Expore IS1",
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: "Denis Inter-Space",
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(abortId) {
  // aborted este egal cu launches
  // adica orice modificare in arborted este facauta in launches
  // De ce? pentru ca e trecuta prin reference
  // Si anume aborted este un pointer si nu un map object nou
  const aborted = launches.get(abortId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLunch,
  abortLaunchById,
};
