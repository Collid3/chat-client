import React, { createContext, useEffect, useState } from "react";
import { protectedApi, api } from "../api/apiCall";
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

	useEffect(() => {
		onAuthStateChanged(auth, async (owner) => {
			if (!owner) {
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

				socket.on("request-accepted", (data) => {
					setMe(data.me);
					setContacts((prev) => [...prev, { ...data.friend, isOnline: true }]);
				});

				socket.on("receive-request", (data) => {
					console.log("Got the request bud");
					setMe(data);
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
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
