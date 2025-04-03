const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    },
    note: {
        type: String
    },
    completionRate: {
        type: String,
        default: 'false'
    }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
