import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Body.css";

const Body = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setShowWelcome(true);
  }, []);

  const handleSendMessage = async () => {
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
      setFadeOut(true);
      setTimeout(() => setShowWelcome(false), 1000); // Fade out after 1s
    }

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { text: data.response || "Sorry, I didn't understand.", sender: "bot" };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 1500); // Simulating bot response delay
    } catch (error) {
      toast.error("Server error. Try again later!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="chat-container">
      {showWelcome && (
        <h2 className={`welcome-text ${fadeOut ? "fade-out" : ""}`}>Welcome to VAssist</h2>
      )}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button className="send-button" onClick={handleSendMessage}>➤</button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Body;
