import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import NewChatForm from "./components/NewChatForm";
import SearchBar from "./components/SearchBar";

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = "https://reenbit-backend.onrender.com";

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chats`);
      setChats(response.data);
      if (response.data.length < 3) {
        for (let i = response.data.length; i < 3; i++) {
          createNewChat({
            firstName: `User${i + 1}`,
            lastName: `LastName${i + 1}`,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async (chatData) => {
    try {
      const response = await axios.post(`${apiUrl}/api/chats`, chatData);
      setChats((prevChats) => [...prevChats, response.data]);
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const updateChat = async (id, chatData) => {
    try {
      const response = await axios.put(`${apiUrl}/api/chats/${id}`, chatData);
      setChats((prevChats) =>
        prevChats.map((chat) => (chat._id === id ? response.data : chat))
      );
      if (selectedChat && selectedChat._id === id) {
        setSelectedChat(response.data);
      }
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  const deleteChat = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/chats/${id}`);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== id));
      if (selectedChat && selectedChat._id === id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const sendMessage = async (chatId, content) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/chats/${chatId}/messages`,
        {
          content,
        }
      );
      setChats((prevChats) =>
        prevChats.map((chat) => (chat._id === chatId ? response.data : chat))
      );
      setSelectedChat(response.data);

      setTimeout(async () => {
        const updatedChatResponse = await axios.get(
          `${apiUrl}/api/chats/${chatId}`
        );
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === chatId ? updatedChatResponse.data : chat
          )
        );
        setSelectedChat(updatedChatResponse.data);
        toast.info("New message received!");
      }, 3500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.firstName} ${chat.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <ToastContainer />
      <div className="custom-wrapper">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <NewChatForm createNewChat={createNewChat} />

        <ChatList
          chats={filteredChats}
          selectChat={setSelectedChat}
          updateChat={updateChat}
          deleteChat={deleteChat}
        />
      </div>
      {selectedChat && (
        <ChatWindow chat={selectedChat} sendMessage={sendMessage} />
      )}
    </div>
  );
}

export default App;
