const mongoose = require("mongoose");

// Flight number example - putem defini mai multe decat type and rq, min / max , defaulValue
// Flight number va lua un objectect cu quieries

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  customers: [String],

  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Connectarea launchesSchema cu "Launches" collection
// primul argument este numele colectiei
// al doilea schema creata de noi
module.exports = mongoose.model("Launch", launchesSchema);
