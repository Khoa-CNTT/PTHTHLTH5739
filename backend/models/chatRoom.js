const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    messageId:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message'
            }
        ]
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
