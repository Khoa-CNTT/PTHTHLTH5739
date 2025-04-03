const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    action: {
        type: String,
    },
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
