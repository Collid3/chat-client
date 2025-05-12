import { createContext, useState } from "react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();
const SOCKET_URL =
  import.meta.env.VITE_ENV === "development"
    ? "http://localhost:5000"
    : "https://chat-server-e9hl.onrender.com";
let userId = false;

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const response = await api.get("/auth/check");
      setMe(response.data);
      userId = response.data._id;
      connectSocket();
    } catch (error) {
      console.log("Error in check auth: ", error);
      setMe(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const signUp = async (data) => {
    setIsSigningUp(true);
    try {
      const response = await api.post("/auth/signup", data);
      setMe(response.data);
      userId = response.data._id;
      toast.success("Account successfully created");
      connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setIsSigningUp(false);
    }
  };

  const logIn = async (data) => {
    setLoggingIn(true);
    try {
      const response = await api.post("/auth/login", data);
      setMe(response.data);
      userId = response.data._id;
      connectSocket();
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setMe(null);
      userId = null;
      toast.success("Logged out successfully");
      disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const response = await api.put("/auth/update-profile", data);
      setMe(response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile: " + error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete("/auth/delete-account");
      await api.get("/auth/logout");
      setMe(null);
      userId = null;
      toast.success("Account successfully deleted");
      disconnectSocket();
    } catch (error) {
      console.log("Error updating profile: " + error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const connectSocket = () => {
    if (!userId || socket) return;

    const Socket = io(SOCKET_URL, {
      query: {
        userId,
      },
    });
    Socket.connect();
    setSocket(Socket);

    Socket.on("getOnlineUsers", (userIds) => {
      return setOnlineUsers(userIds);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        me,
        checkingAuth,
        checkAuth,
        isSigningUp,
        signUp,
        loggingIn,
        logIn,
        logout,
        isUpdatingProfile,
        updateProfile,
        onlineUsers,
        socket,
        deleteAccount,
        isDeletingAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
