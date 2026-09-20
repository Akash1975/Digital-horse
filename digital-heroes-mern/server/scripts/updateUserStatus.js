
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
    const statusInput = await askQuestion(
      "Enter status (activate/deactivate): "
    );

    const email = userEmail.toLowerCase().trim();
    const status = statusInput.toLowerCase().trim();

    if (!email || !["activate", "deactivate"].includes(status)) {
      throw new Error(
        "Enter a valid email and status (activate/deactivate)."
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    user.isActive = status === "activate";

    await user.save();

    console.log(
      `\nUser ${status}d successfully!`
    );
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Status:", user.isActive ? "Active ✅" : "Inactive ❌");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\nStatus update failed:", error.message);

    rl.close();
    process.exit(1);
  }
};

updateUserStatus();