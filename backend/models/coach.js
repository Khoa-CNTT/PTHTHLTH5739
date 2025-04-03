const mongoose = require("mongoose");

const coachSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    introduce: {
      type: String,
    },
    selfImage: {
      type: [String],
    },
    contract: {
      type: String,
    },
    certificate: {
      type: [String],
    },
    experience: [
      {
        time: {
          type: String,
        },
        workplace: {
          type: String,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Coach = mongoose.model("Coach", coachSchema);

module.exports = Coach;
