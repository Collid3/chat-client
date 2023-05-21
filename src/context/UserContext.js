import React, { createContext, useEffect, useState } from "react";
import { api } from "../api/apiCall";
import { io } from "socket.io-client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
const UserContext = createContext({});
const socket = io.connect("http://localhost:5000");

export const UserProvider = ({ children }) => {
	const [me, setMe] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [sidebar, setSidebar] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, async (owner) => {
			if (!owner) {
				setLoading(false);
				return setMe(null);
			}

			setLoading(true);
			try {
				const userData = await api.post("/auth", { email: owner.email });

				setMe({ ...userData.data.user, isOnline: true });
				const response = await api.get(`/users/contacts/${userData.data.user._id}`);

				socket.emit("addUser", userData.data.user._id);

				socket.on("getUsers", (users) => {
					const newContacts = response.data.users.map((user) =>
						users.find((user1) => user._id === user1.userId) !== undefined
							? { ...user, isOnline: true }
							: user
					);

					setContacts(newContacts);
					setOnlineUsers(users);
				});

				socket.on("receive-message", (data) => {
					setMessages((prev) => [...prev, data.newMessage]);
				});

				socket.on("receive-request", (data) => {
					setMe(data);
				});

				socket.on("request-accepted", (data) => {
					setMe(data.me);
					setContacts((prev) => [...prev, { ...data.friend, isOnline: true }]);
				});

				socket.on("request-rejected", (data) => {
					setMe(data.me);
				});

				setLoading(false);
			} catch (err) {
				console.log(err.message);
				setLoading(false);
			}
		});
	}, []);

	return (
		<UserContext.Provider
			value={{
				loading,
				contacts,
				me,
				setMe,
				selectedChat,
				setSelectedChat,
				socket,
				onlineUsers,
				setContacts,
				messages,
				setMessages,
				sidebar,
				setSidebar,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
