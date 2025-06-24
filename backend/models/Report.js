const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  deviceId: { type: String, required: true },  
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
