const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    option: {
        type: String
    },
    image: {
        type: String
    }
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;