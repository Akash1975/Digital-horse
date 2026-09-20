require("dotenv").config();

const bcrypt = require("bcryptjs");
const readline = require("readline");
const connectDB = require("../config/db");
const User = require("../models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const createAdmin = async () => {
  try {
    const adminName = await askQuestion("Enter admin name: ");
    const adminEmail = await askQuestion("Enter admin email: ");
    const adminPassword = await askQuestion("Enter admin password: ");

    if (!adminName || !adminEmail || !adminPassword) {
      throw new Error("All fields are required.");
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: adminEmail.toLowerCase().trim(),
    });

    if (existingUser) {
      existingUser.role = "admin";
      existingUser.isActive = true;
      existingUser.isEmailVerified = true;

      await existingUser.save();

      console.log("Existing user promoted to admin.");
      console.log("Email:", existingUser.email);

      rl.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    });

    console.log("\nAdmin created successfully!");
    console.log("Admin ID:", admin._id);
    console.log("Email:", admin.email);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);

    rl.close();
    process.exit(1);
  }
};

createAdmin();
