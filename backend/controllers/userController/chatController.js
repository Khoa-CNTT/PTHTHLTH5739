const mongoose = require("mongoose");
const ChatRoom = require("../../models/chatRoom");
const Message = require("../../models/message");
const Subscription = require("../../models/subscription");
const OpenAI = require("openai");

module.exports = (io) => {
  // Get or create chat room based on subscriptionId
  const getOrCreateChatRoom = async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const subscription = await Subscription.findById(subscriptionId)
        .populate("userId")
        .populate({
          path: "courseId",
          populate: { path: "coachId" },
        });

      if (!subscription)
        return res.status(404).json({ error: "Subscription not found" });

      let chatRoom = await ChatRoom.findOne({
        _id: subscription.chatRoomId,
      }).populate({
        path: "messageId",
        populate: { path: "senderId", select: "avatar name" }, // Populate both avatar and name
      });

      if (!chatRoom) {
        chatRoom = new ChatRoom();
        await chatRoom.save();
        subscription.chatRoomId = chatRoom._id;
        await subscription.save();
      }

      res.json({
        chatRoom,
        userId: subscription.userId._id,
        coachId: subscription.courseId.coachId._id,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

  const sendMessage = async (req, res) => {
    try {
      const { chatRoomId, senderId, message } = req.body;
      console.log("Request Body:", req.body);

      if (!message || !chatRoomId) {
        return res.status(400).json({ error: "Message and chatRoomId are required." });
      }

      if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
        console.error("Invalid chatRoomId:", chatRoomId);
        return res.status(400).json({ error: "Invalid chatRoomId format." });
      }

      const isAI = senderId === "AI";
      const validSenderId = isAI ? null : senderId;

      if (
        !isAI &&
        (!validSenderId || !mongoose.Types.ObjectId.isValid(validSenderId))
      ) {
        console.error("Invalid senderId:", senderId);
        return res.status(400).json({ error: "Invalid senderId format." });
      }

      // Create and save the user's message
      const userMessage = new Message({ senderId: validSenderId, message });
      await userMessage.save();

      // Find the chat room
      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        console.error("Chat room not found:", chatRoomId);
        return res.status(404).json({ error: "Chat room not found." });
      }

      // Add the message ID to the chat room
      chatRoom.messageId.push(userMessage._id);
      await chatRoom.save();

      // Broadcast the message to the room
      io.to(chatRoomId).emit("receive-message", {
        senderId: validSenderId,
        message,
      });

      res.status(201).json(userMessage);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({ error: "Could not send message." });
    }
  };

  // Export the functions as part of the controller
  return { getOrCreateChatRoom, sendMessage };
};
