import "../styles/chats.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";

import { IoMdAttach } from "react-icons/io";

const MainChats = () => {
	const { selectedChat, me, socket, onlineUsers, messages, setMessages } =
		useContext(UserContext);

	const [roomId, setRoomId] = useState("");
	const textRef = useRef("");
	const lastMessage = useRef(null);

	useEffect(() => {
		if (!selectedChat) return;

		const fetchMessages = async () => {
			const roomData = await api.get(`/messageRoom/${me._id}/${selectedChat._id}`);
			const roomId = roomData.data.room._id;
			setRoomId(roomId);

			const response = await api.get(`/messages/${roomId}`);
			setMessages(response.data.messages);
		};

		fetchMessages();
	}, [selectedChat, setMessages, me._id]);

	const handleSend = async () => {
		if (textRef.current.value === "") return;

		const newMessage = {
			messageRoomId: roomId,
			senderId: me._id,
			text: textRef.current.value,
		};
		await api.post("/messages", newMessage);

		const friend = onlineUsers.find((user) => user.userId === selectedChat._id);
		if (friend) {
			socket.emit("send-message", { to: friend.socketId, newMessage });
		}

		setMessages((prev) => [...prev, newMessage]);
		textRef.current.value = "";
		// lastMessage.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="main-chats-container">
			{!selectedChat && (
				<>
					<h1>No Chat selected</h1>
				</>
			)}

			{selectedChat && (
				<>
					<header>
						<h3>{selectedChat.username}</h3>

						<div>Options</div>
					</header>

					<main className="chats-container">
						{messages.length > 0 ? (
							messages.map((message) => (
								<section className="message" key={message._id} ref={lastMessage}>
									{message.text}
								</section>
							))
						) : (
							<p>Send something to start chat</p>
						)}
					</main>

					<footer>
						<input type="text" placeholder="Type something..." ref={textRef} />

						<div className="buttons">
							<IoMdAttach />
							<button onClick={handleSend}>Send</button>
						</div>
					</footer>
				</>
			)}
		</div>
	);
};

export default MainChats;
