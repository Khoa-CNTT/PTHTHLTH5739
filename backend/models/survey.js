const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
    coach:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    level: {
        type: String
    },
    dayPerWeek: {
        type: [String]
    },
    hourPerDay: {
        type: String
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    surveyOptions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        optionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Option'
        }
    }],
    surveyDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
