import React, { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";

const MainChats = () => {
	const { selectedChat } = useContext(UserContext);

	useEffect(() => {
		if (!selectedChat) return;

		const fetchMessages = async (id) => {
			const response = await api.get(`/messages/${selectedChat._id}`);
			console.log(response);
		};

		fetchMessages();
	}, [selectedChat]);

	return (
		<div className="main-chats-container">
			{!selectedChat && (
				<>
					<h1>No Chat selected</h1>
				</>
			)}
		</div>
	);
};

export default MainChats;
