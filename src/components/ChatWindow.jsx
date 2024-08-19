import React, { useState, useEffect } from "react";
import moment from "moment";

function ChatWindow({ chat, sendMessage }) {
  const [message, setMessage] = useState("");
  const [localChat, setLocalChat] = useState(chat);

  useEffect(() => {
    setLocalChat(chat);
  }, [chat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(localChat._id, message);
      setMessage("");
    }
  };

  return (
    <div className="chat-window">
      <h2>
        {localChat.firstName} {localChat.lastName}
      </h2>
      <div className="messages">
        {localChat.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.content}</p>
            <small>{moment(msg.timestamp).format("HH:mm")}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;
