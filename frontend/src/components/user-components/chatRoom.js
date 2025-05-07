import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import moment from "moment";
import axios from "axios";
import { Card, Avatar, Tooltip, Space, Button } from "antd";
import ReactMarkdown from "react-markdown";

const socket = io("http://localhost:4000");

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [coachId, setCoachId] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const latestMessageRef = useRef(null);
  const accountId = localStorage.getItem("accountId");
  const { subscriptionId } = useParams();
  const token = localStorage.getItem("token");

  const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCXpBDbNyh8SUTxVN-atdlNoP7V7yIv_VE"; //endpoint của Gemini
  const geminiApiKey = "AIzaSyCXpBDbNyh8SUTxVN-atdlNoP7V7yIv_VE";     //API key của Gemini

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/chatroom/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.chatRoom && data.chatRoom._id) {
          setChatRoomId(data.chatRoom._id);
          setUserId(data.userId ?? null);
          setCoachId(data.coachId ?? null);

          socket.emit("join-room", { roomId: data.chatRoom._id });

          setMessages(data.chatRoom.messageId ?? []);
        } else {
          console.error("Chat room or necessary data is missing:", data);
        }
      })
      .catch((error) => console.error("Error fetching chat room:", error));

    // Update messages when new message is received through socket
    socket.on("receive-message", async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/chatroom/${subscriptionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data && data.chatRoom && data.chatRoom._id) {
          setMessages(data.chatRoom.messageId ?? []);
        } else {
          console.error("Error: Chat room or necessary data is missing", data);
        }
      } catch (error) {
        console.error("Error fetching updated chat room:", error);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [subscriptionId, token]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    setIsLoading(true);

    const newMessage = {
      chatRoomId,
      senderId: accountId,
      message,
    };

    setMessage("");

    try {
      await fetch("http://localhost:4000/api/users/chatroom/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (message.trim().includes("@AI")) {
        const recentMessages = messages.slice(-10);
        const promptHistory = recentMessages
          .map((msg) => {
            if (msg.senderId?._id === "AI" || msg.senderId === null) {
              return `AI: ${msg.message}`;
            } else if (msg.senderId?._id === accountId) {
              return `User: ${msg.message}`;
            } else {
              return `Coach: ${msg.message}`;
            }
          })
          .join("\n");

        const prompt = `${promptHistory}\nUser: ${message
          .replace("@AI", "")
          .trim()}`;

        try {
          const response = await axios.post(
            geminiEndpoint, // Sử dụng endpoint của Gemini
            {
              model: "gemini-2.0-flash", // Hoặc model Gemini bạn muốn sử dụng
              contents: [
                {
                  parts: [
                    {
                      text: `Bạn là một chuyên gia về thể hình và chế độ dinh dưỡng. Bạn chỉ trả lời các câu hỏi liên quan đến tập luyện gym, dinh dưỡng và sức khoẻ của bạn. Bạn hãy từ chối trả lời những câu hỏi chủ đề khác không liên quan.\n\n${prompt}`,
                    },
                  ],
                },
              ],
              generation_config: {
                max_output_tokens: 1000,
                temperature: 0.7, // kiểm soát của đầu ra từ (0-1) tập trung đến ngẫu nhiên sáng tạo hơn
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": geminiApiKey, // Sử dụng API key của Gemini
              },
            }
          );

          const aiResponse = response.data.candidates[0].content.parts[0].text.trim();

          const aiMessage = {
            chatRoomId,
            senderId: "AI",
            message: aiResponse,
          };

          await fetch("http://localhost:4000/api/users/chatroom/send-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(aiMessage),
          });
        } catch (error) {
          console.error("Error with Gemini API:", error);
        }
      }

      const response = await fetch(
        `http://localhost:4000/api/users/chatroom/${subscriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data && data.chatRoom && data.chatRoom._id) {
        setMessages(data.chatRoom.messageId ?? []);
      } else {
        console.error("Error: Chat room or necessary data is missing", data);
      }
    } catch (error) {
      console.error("Error sending message or fetching chat room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return messages.map((msg, index) => {
      const messageDate = moment(msg.createAt).format("YYYY-MM-DD");
      const isNewDay = messageDate !== lastDate;
      lastDate = messageDate;

      const isAI = msg.senderId === null || msg.senderId?._id === "AI";
      const isLastMessage = index === messages.length - 1;

      const senderAvatar = isAI
        ? "https://i.pinimg.com/originals/41/7b/16/417b164404395c70a1bbd36b44c1ef10.gif"
        : msg.senderId.avatar;

      const avatarStyle = {
        backgroundImage: senderAvatar ? `url(${senderAvatar})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginLeft: isAI || msg.senderId?._id === accountId ? "10px" : "0",
        marginRight: isAI || msg.senderId?._id !== accountId ? "10px" : "0",
      };

      return (
        <React.Fragment key={index}>
          {isNewDay && (
            <div
              style={{
                textAlign: "center",
                margin: "10px 0",
                color: "#ccc",
                fontStyle: "italic",
              }}
            >
              <span>{moment(msg.createAt).format("dddd, MMMM Do")}</span>
            </div>
          )}

          <Tooltip
            title={moment(msg.createAt).format("HH:mm DD/MM/YYYY")}
            placement="bottomRight"
            overlayStyle={{
              backgroundColor: "#333",
              color: "#fff",
            }}
          >
            <div
              className={`message ${isAI
                  ? "ai-message"
                  : msg.senderId?._id === accountId
                    ? "sent"
                    : "received"
                }`}
              ref={isLastMessage ? latestMessageRef : null}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "10px",
                backgroundColor: isAI ? "#444" : "#333",
                color: "#fff",
                padding: "12px",
                borderRadius: "12px",
                maxWidth: "70%",
                width: "fit-content",
                marginLeft: isAI
                  ? "0"
                  : msg.senderId?._id === accountId
                    ? "auto"
                    : "0",
                marginRight: isAI
                  ? "0"
                  : msg.senderId?._id !== accountId
                    ? "auto"
                    : "0",
                flexDirection:
                  msg.senderId?._id === accountId ? "row-reverse" : "row",
                wordBreak: "break-word",
              }}
            >
              <div style={avatarStyle}></div>

              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: isAI ? "bold" : "normal",
                    color: "#fff",
                    textAlign:
                      msg.senderId?._id === accountId ? "right" : "left",
                  }}
                >
                  {isAI
                    ? "AI"
                    : msg.senderId?._id === coachId
                      ? `HLV: ${msg.senderId?.name}`
                      : msg.senderId?._id === userId
                        ? `Bạn: ${msg.senderId?.name}`
                        : `${msg.senderId?.name}`}
                </span>

                <span
                  style={{
                    display: "block",
                    color: "#fff",
                    fontSize: "15px",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 style={{ color: "#fff" }}>{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 style={{ color: "#fff" }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{ color: "#fff" }}>{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 style={{ color: "#fff" }}>{children}</h4>
                      ),
                      h5: ({ children }) => (
                        <h5 style={{ color: "#fff" }}>{children}</h5>
                      ),
                      h6: ({ children }) => (
                        <h6 style={{ color: "#fff" }}>{children}</h6>
                      ),
                      p: ({ children }) => (
                        <p style={{ color: "#fff" }}>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: "#fff" }}>{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em style={{ color: "#fff" }}>{children}</em>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          {children}
                        </a>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            backgroundColor: "#2d2d2d",
                            color: "#fff",
                            padding: "0.2em",
                            borderRadius: "4px",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            color: "#fff",
                            borderLeft: "4px solid #fff",
                            paddingLeft: "10px",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul style={{ color: "#fff" }}>{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{ color: "#fff" }}>{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ color: "#fff !important" }}>{children}</li>
                      ),
                      inlineCode: ({ children }) => (
                        <code
                          style={{
                            backgroundColor: "#2d2d2d",
                            color: "#fff",
                            padding: "0.2em",
                            borderRadius: "4px",
                          }}
                        >
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {msg.message}
                  </ReactMarkdown>
                </span>
              </div>
            </div>
          </Tooltip>
        </React.Fragment>
      );
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#222",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "20px",
          maxHeight: "80vh",
        }}
      >
        {renderMessages()}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <textarea
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #444",
            resize: "none",
            marginBottom: "10px",
            fontSize: "14px",
            backgroundColor: "#333",
            color: "#fff",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={1}
        />
        <Button
          onClick={sendMessage}
          type="primary"
          loading={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "16px",
            height: "50px",
            border: "none",
            transition: "none",
          }}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;