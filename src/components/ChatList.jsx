import React from "react";
import moment from "moment";

function ChatList({ chats, selectChat, updateChat, deleteChat }) {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat._id} className="chat-item">
          <div onClick={() => selectChat(chat)}>
            <h3>
              {chat.firstName} {chat.lastName}
            </h3>
            <p>{chat.lastMessage}</p>
            <small>
              {chat.lastMessageTime
                ? moment(chat.lastMessageTime).format("HH:mm")
                : ""}
            </small>
          </div>
          <button
            onClick={() => {
              const newFirstName = prompt(
                "Enter new first name:",
                chat.firstName
              );
              const newLastName = prompt("Enter new last name:", chat.lastName);
              if (newFirstName && newLastName) {
                updateChat(chat._id, {
                  firstName: newFirstName,
                  lastName: newLastName,
                });
              }
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteChat(chat._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
