import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const DoctorChatBox = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  let typingTimeout = null;

  useEffect(() => {
    if (!roomId) return;

    const onConnect = () => {
      console.log("Socket connected, joining room:", roomId);
      socket.emit("join_room", roomId);
    };

    socket.connect();

    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    // Incoming messages
    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setChat((prev) => [
        ...prev,
        {
          message: data.message,
          sender: data.sender.toLowerCase(),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      if (data.sender.toLowerCase() === "patient") {
        setTyping(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setTyping(false), 2000);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  // Emit typing event
  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      room: roomId,
      sender: "doctor",
    });
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        room: roomId,
        message,
        sender: "doctor",
      });
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto">
      <div
        className="h-60 overflow-y-auto border-b mb-2 p-2 space-y-1"
        ref={chatRef}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded max-w-xs ${
              msg.sender === "doctor"
                ? "bg-blue-100 text-blue-800 ml-auto text-right"
                : "bg-green-100 text-green-800"
            }`}
          >
            <div>
              <strong className="capitalize">{msg.sender}</strong>
            </div>
            <div>{msg.message}</div>
            <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
          </div>
        ))}
        {typing && (
          <div className="text-xs text-gray-500 italic">
            Patient is typing...
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="border p-2 flex-1 rounded"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DoctorChatBox;
