const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    hiringApply: [
      {
        cvFile: {
          type: String,
        },
        frontIDCard: {
          type: String,
        },
        backIDCard: {
          type: String,
        },
        facePhoto: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        applyStatus: {
          type: String,
          enum: ["pending", "accepted", "denied"],
          default: "pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ['activate', 'blocked', 'non-activate'],
      default: "activate",
    },
    role: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
