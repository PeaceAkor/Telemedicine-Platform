import React, { useEffect, useState, useRef } from "react";
import socket from "../../admin/src/socket";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

const ChatBox = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef(null);
  const fileInputRef = useRef();

  let typingTimeout = null;

  useEffect(() => {
    if (!roomId) return;

    const onConnect = () => {
      socket.emit("join_room", roomId);
    };

    socket.connect();

    if (socket.connected) onConnect();
    else socket.on("connect", onConnect);

    const handleReceiveMessage = (data) => {
      // Add default type if missing to avoid render issues
      if (!data.type) data.type = "text";

      console.log("Received message in patient chat:", data);
      setChat((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    const handleTyping = (data) => {
      if (data.sender.toLowerCase() === "doctor") {
        setTyping(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setTyping(false), 2000);
      }
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [roomId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const handleTypingInput = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { room: roomId, sender: "patient" });
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msg = {
        room: roomId,
        message,
        sender: "patient",
        type: "text",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("send_message", msg);
      setMessage(""); // Clear input after sending
      setChat((prev) => [...prev, msg]); // Show sent message immediately
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !roomId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/upload",
        formData
      );

      const msg = {
        room: roomId,
        file: response.data.url,
        filename: file.name,
        sender: "patient",
        type: "file",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("send_message", msg);
      setChat((prev) => [...prev, msg]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto relative">
      <div
        ref={chatRef}
        className="h-60 overflow-y-auto border-b mb-2 p-2 space-y-1"
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded max-w-xs ${
              msg.sender === "patient"
                ? "bg-blue-100 ml-auto text-right"
                : "bg-green-100"
            }`}
          >
            <div>
              <strong className="capitalize">{msg.sender}</strong>
            </div>
            {msg.type === "text" && <div>{msg.message}</div>}
            {msg.type === "file" && (
              <div>
                {/\.(jpeg|jpg|png|gif|webp)$/i.test(msg.file) ? (
                  <img
                    src={msg.file}
                    alt={msg.filename}
                    className="w-40 h-auto rounded"
                  />
                ) : (
                  <a
                    href={msg.file}
                    download={msg.filename}
                    className="text-blue-500 underline"
                  >
                    {msg.filename}
                  </a>
                )}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
          </div>
        ))}
        {typing && (
          <div className="text-xs text-gray-500 italic">
            Doctor is typing...
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={message}
          onChange={handleTypingInput}
          onKeyDown={handleKeyDown}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        <button onClick={() => fileInputRef.current.click()}>📎</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={sendFile}
          className="hidden"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Send
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-16 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
