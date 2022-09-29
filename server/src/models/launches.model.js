const launches = new Map();

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),

  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

// target: 'Happiest Planet On Earth',

//launches.set(launch.flightNumber,launch) ;
saveLaunch(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

// function getAllLaunches() {
//   return Array.from(launches.values()) ;
// }

async function getAllLaunches() {
  return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0 })
};

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

async function saveLaunch(launch) {
  // var mongoose = require('mongoose');
  // while(mongoose.connection.readyState !== 1) {
  //   setTimeout(() => {
  //     console.log('Waiting one second ...');
  //   },1000) ;
  // }
  // console.log(`Mongoose connection state: ${mongoose.connection.readyState}`) ;
  const planet = await planets.findOne({
    keplerName: launch.target,
  }) ;
  if(!planet) {
    throw new Error('No matching planet found!');
  }
  
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  },
    launch, {
    upsert: true,
  });

  //console.log(`Could not save launch: ${error}`);


}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
}