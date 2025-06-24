const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express(); 
const PORT = 5000; 
app.use(express.json());
const mongoose = require("mongoose");
const Report = require("./models/Report");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

app.get("/api/reports", async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
     const reports = await Report.find({ timestamp: { $gte: oneDayAgo } }).sort({ timestamp: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error fetching reports." });
  }
});

app.post("/api/report", async (req, res) => {
  try {
    const { description, latitude, longitude, deviceId } = req.body;

    if (!description || !latitude || !longitude || !deviceId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newReport = new Report({
      description,
      latitude,
      longitude,
      deviceId,
    });

    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully." });
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).json({ message: "Server error while saving report." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
