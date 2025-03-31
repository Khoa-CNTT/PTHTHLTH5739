// config/mongodb.js
const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://fitzone:fitzone@fitzone.npfmn.mongodb.net/?retryWrites=true&w=majority&appName=fitzone`, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(chalk.yellowBright("MongoDB Connected!\n"));
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    console.error(chalk.red(`Error: not connect`));
    process.exit(1);
  }
};

module.exports = connectDB;

