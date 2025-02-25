import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Body.css";

const Body = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) {
      toast.error("Input cannot be empty!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "dark",
      });
      return;
    }

    if (showWelcome) {
      setFadeOut(true); // Start fade-out animation
      setTimeout(() => setShowWelcome(false), 1000); // Remove after animation
    }

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = { text: "This is a response from VAssist!", sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="chat-container">
      {/* Welcome Text with Smooth Fade-Out */}
      {showWelcome && (
        <h2 className={`welcome-text ${fadeOut ? "fade-out" : ""}`}>
          Welcome to VAssist
        </h2>
      )}

      {/* Chat Messages */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>➤</button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Body;
