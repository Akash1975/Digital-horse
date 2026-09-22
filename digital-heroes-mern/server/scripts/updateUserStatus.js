require("dotenv").config();

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

const updateUserStatus = async () => {
  try {
    const userEmail = await askQuestion("Enter user email: ");

    const email = userEmail.toLowerCase().trim();

    if (!email) {
      throw new Error("Please enter a valid email.");
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    // Show current user details and status
    console.log("\n==============================");
    console.log("        USER DETAILS");
    console.log("==============================");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log(
      "Current Status:",
      user.isActive ? "Active ✅" : "Inactive ❌"
    );
    console.log("==============================\n");

    const statusInput = await askQuestion(
      "Enter status (activate/deactivate): "
    );

    const status = statusInput.toLowerCase().trim();

    if (!["activate", "deactivate"].includes(status)) {
      throw new Error(
        "Invalid status. Enter activate or deactivate."
      );
    }

    user.isActive = status === "activate";

    await user.save();

    console.log(`\nUser ${status}d successfully!`);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log(
      "New Status:",
      user.isActive ? "Active ✅" : "Inactive ❌"
    );

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\nStatus update failed:", error.message);

    rl.close();
    process.exit(1);
  }
};

updateUserStatus();
