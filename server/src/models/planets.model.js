const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo') ;

//const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,"..",'..','data','kepler_data.csv')) 
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                // TODO: Replace below create with insert + update = upsert
                // await planets.updateOne ({
                //     keplerName: data.kepler_name,
                // });
                savePlanet(data) ;
                // habitablePlanets.push(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err) ;
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length ;
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve() ;
        });
    }) ;
}

async function savePlanet(planet) {
    try {
        await planets.updateOne ({
            keplerName: planet.kepler_name,
           },{
            keplerName: planet.kepler_name ,
          }, {
              upsert: true,
          });        
    } catch (error) {
        console.log(`Could not save the planet: ${error}`);
    }

};

async function getAllPlanets() {
    return await planets.find({}, {
      '_id': 0, '__v': 0,
    });
}

  module.exports = {
      loadPlanetsData,
      getAllPlanets,
  }