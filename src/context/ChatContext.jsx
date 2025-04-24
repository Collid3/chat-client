import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/axios";
import AuthContext from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const getUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get("/messages/users");
      setUsers(response.data.users);
    } catch (error) {
      console.log("Error getting users: ", error);
      toast.error("Couldnd't load users. Please refresh the page");
    } finally {
      setLoadingUsers(false);
    }
  };

  const getMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      const response = await api.get(`/messages/${userId}`);

      setMessages(response.data);
    } catch (error) {
      console.log("Error getting messages: ", error);
      toast.error("Couldnd't load messages. Please refresh the page");
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (data) => {
    try {
      const response = await api.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      setMessages((prev) => {
        return [...prev, response.data.message];
      });
    } catch (error) {
      console.log("Error sending message in context: ", error);
      toast.error("Failed to send message");
    }
  };

  const subscribeToMessages = () => {
    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (!(newMessage.senderId === selectedUser._id)) return;

      setMessages((prev) => {
        return [...prev, newMessage];
      });
    });
  };

  const unsubscribeFromMessages = () => {
    socket.off("newMessage");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        setSelectedUser,
        loadingMessages,
        loadingUsers,
        getUsers,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
