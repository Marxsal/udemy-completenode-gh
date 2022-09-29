const mongoose = require("mongoose") ;

const planetsSchema = new mongoose.Schema({
    keplerName:   {
        type: String,
        required: true
      },
});

module.exports = mongoose.model('Planet',planetsSchema) ;
/*
COLUMN kepid:          KepID
# COLUMN kepoi_name:     KOI Name
# COLUMN kepler_name:    Kepler Name
*/