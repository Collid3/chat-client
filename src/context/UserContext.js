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
	const [selectedContact, setSelectedContact] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		onAuthStateChanged(auth, async (owner) => {
			if (!owner) {
				return setMe(null);
			}

			const userData = await api.post("/auth", { email: owner.email });
			setMe({ ...userData.data.user, isOnline: true });

			try {
				const response = await api.get(`/users/contacts/${userData.data.user._id}`);
				setContacts(response.data.users);

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
				});

				socket.on("receive-request", (data) => {
					console.log("Got the request bud");
					setMe(data);
				});
			} catch (err) {
				console.log(err.message);
			}
		});
	}, []);

	useEffect(() => {
		if (!selectedContact) return;

		const fetchMessages = async (id) => {
			const response = await api.get(`/messages/${selectedContact._id}`);
		};

		return () => fetchMessages();
	}, [selectedContact]);

	return (
		<UserContext.Provider
			value={{
				contacts,
				me,
				setMe,
				selectedContact,
				setSelectedContact,
				socket,
				onlineUsers,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
