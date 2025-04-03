const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
    },
    progressId: [
        {
            type: Schema.Types.ObjectId,
            ref: "Progress",
        },
    ],
    preview: {
        video: {
            type: String,
        },
        advice: 
            {
                timestamp: {
                    type: Number, // Timestamp in seconds
                },
                text: {
                    type: String,
                },
            },
    },
    listVideo: [
        {
            type: String,
            required: true,
        },
    ],
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
