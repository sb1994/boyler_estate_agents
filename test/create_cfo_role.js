require("dotenv").config(); // Load your env (dev or prod)
const mongoose = require("mongoose");
const JobRole = require("../v1/models/JobRole"); // Adjust path if needed

const seedCEO = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const ceoExists = await JobRole.findOne({
      title: "Chief Financial Officer",
    });
    if (ceoExists) {
      console.log("✅ CEO role already exists. Skipping...");
      return mongoose.disconnect();
    }

    const ceoRole = new JobRole({
      title: "Chief Financial Officer",
      baseSalary: 200000,
      lowSalary: 180000,
      highSalary: 250000,
      grade: 1,
      createdBy: "67bf4a1a1d09cb63bd474915",
      approvedBy: "67bf4a1a1d09cb63bd474915",
      department: "67fed6d3f8f78562c6919e73",
      hiringManager: "67bf4a1a1d09cb63bd474915",
      status: "approved",
    });

    await ceoRole.save();
    console.log("🚀 CFO role seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding CEO role:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedCEO();
