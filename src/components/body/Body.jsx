import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Body.css";

const Body = () => {
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  // Function to handle message sending
  const handleSendMessage = () => {
    if (!input.trim()) {
      toast.error("Input cannot be empty!", {
        position: "top-center",
        autoClose: 3000, // Time before it disappears
        hideProgressBar: false, // Show the countdown timer
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
      return;
    }
    console.log("Message Sent:", input);
    setInput(""); // Clear input after sending
  };
  

  return (
    <div className="chat-container">
      {!inputFocused && <h2 className="welcome-text">Welcome to VAssist</h2>}

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={(e) => {
            if (!e.target.value) setInputFocused(false);
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>➤</button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Body;
