//
const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

// functie to load launches form spaceX api
const SPACE_API_URL = `https://api.spacexdata.com/v4/launches/query`;

async function populateLaunches() {
  const response = await axios.post(SPACE_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log(`Priblem downloading launches`);
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["succes"],
      customers: [...new Set(customers)],
    };

    //TODO populate launches data
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  // in populate trecem path pentru chestii care se afla in alte paths"
  // si anume rocket exista, dar este un cod si daca folosim acel code pe /rocket - o sa ne dea un obiect
  // acel obiect are in interior o proprietate name - unde se afla numele la rocket - 1 se pune sa ne dea rezultat
  // la fel si pentru payload

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("The data already exist");
    return;
  } else {
    await populateLaunches();
  }

  console.log("Dowloading launch data");
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getLeatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planets found");
  }

  const newFlightNumber = (await getLeatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: "Denis Inter-Space",
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: "Denis Inter-Space",
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

async function abortLaunchById(abortId) {
  // aborted este egal cu launches
  // adica orice modificare in arborted este facauta in launches
  // De ce? pentru ca e trecuta prin reference
  // Si anume aborted este un pointer si nu un map object nou
  // const aborted = launches.get(abortId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;

  // trecem upsert to false pentru ca nu vrem sa adaugam un document nou in collectie
  const aborted = await launches.updateOne(
    {
      flightNumber: abortId,
    },
    {
      upcoming: false,
      success: false,
    },
    { upsert: false }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch,
};
