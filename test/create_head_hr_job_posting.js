require("dotenv").config();
const mongoose = require("mongoose");
const JobPosting = require("../v1/models/JobPosting");
const JobRole = require("../v1/models/JobRole");

const seedHeadOfHRPosting = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to MongoDB");

    // Get existing JobRole for Head of HR
    const jobRole = await JobRole.findById("680021482834d37cb7c60d26");
    if (!jobRole) {
      console.error("❌ Head of HR JobRole not found");
      return mongoose.disconnect();
    }

    // Seed Job Posting for Head of HR
    const newJobPosting = new JobPosting({
      jobRole: jobRole._id,
      title: "Head of Human Resources",
      description:
        "We are looking for an experienced HR leader to shape and execute our people strategy.",
      requirements: [
        "10+ years in HR leadership",
        "Strong understanding of employment law in Ireland",
        "Proven experience in scaling HR teams",
      ],
      benefits: [
        "Private healthcare",
        "Generous bonus structure",
        "Hybrid work environment",
      ],
      location: "Dublin, Ireland",
      employmentType: "full-time",
      skills: ["Leadership", "Employment Law", "Strategy"],
      postedBy: "67bf4a1a1d09cb63bd474915", // Replace with real User ID (e.g. HR Manager/Admin)
      status: "open",
    });

    const savedPosting = await newJobPosting.save();
    console.log("✅ Job Posting created:", savedPosting.title);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    mongoose.disconnect();
  }
};

seedHeadOfHRPosting();
