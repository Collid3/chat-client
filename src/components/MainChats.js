import "../styles/chats.css";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";
import { IoMdAttach } from "react-icons/io";

import loader from "../assets/loader2.gif";

const MainChats = () => {
	const {
		selectedChat,
		me,
		socket,
		onlineUsers,
		messages,
		setMessages,
		setSidebar,
		sidebar,
		setContacts,
	} = useContext(UserContext);

	const [roomId, setRoomId] = useState("");
	const textRef = useRef("");
	const lastMessage = useRef(null);
	const [loading, setLoading] = useState(true);

	useMemo(() => {
		if (!selectedChat) {
			return setLoading(false);
		}

		const fetchMessages = async () => {
			setLoading(true);
			try {
				const roomData = await api.get(`/messageRoom/${me._id}/${selectedChat._id}`);
				const roomId = roomData.data.room._id;
				setRoomId(roomId);

				const response = await api.get(`/messages/${roomId}`);
				setMessages(response.data.messages);
				setLoading(false);
			} catch (err) {
				console.log(err.message);
				setLoading(false);
			}
		};

		fetchMessages();
	}, [selectedChat, setMessages, me._id]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (textRef.current.value === "") return;

		const newMessage = {
			messageRoomId: roomId,
			sender: me._id,
			text: textRef.current.value,
		};
		const response = await api.post("/messages", newMessage);

		const friend = onlineUsers.find((user) => user.userId === selectedChat._id);
		if (friend) {
			socket.emit("send-message", { to: friend.socketId, newMessage: response.data.message });
		}

		setMessages((prev) => [...prev, response.data.message]);
		setContacts((prev) => {
			return prev.map((contact) =>
				contact._id === selectedChat._id
					? { ...contact, lastMessage: response.data.message }
					: contact
			);
		});
		textRef.current.value = "";
	};

	useEffect(() => {
		if (!lastMessage.current) return;
		lastMessage.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<form className="main-chats-container" onSubmit={(e) => handleSend(e)}>
			{!selectedChat && !loading && (
				<>
					<h1 style={{ height: "100vh", display: "grid", placeContent: "center" }}>
						Select any contact to start a chat
					</h1>
				</>
			)}

			{loading && !sidebar && (
				<div className="loading-page">
					<img src={loader} alt="Loading..." />
				</div>
			)}

			{selectedChat && !loading && (
				<>
					<header>
						<h3>{selectedChat.username}</h3>

						<button
							type="button"
							onClick={() => {
								setSidebar(true);
							}}>
							back
						</button>
					</header>

					<main className="chats-container">
						{messages.length > 0 ? (
							messages.map((message) => (
								<div
									className={message.sender === me._id ? "message me" : "message"}
									key={message._id}
									ref={lastMessage}>
									<section>{message.text}</section>
									<p>
										{new Date(message.createdAt)
											.getHours()
											.toLocaleString("en-US", {
												minimumIntegerDigits: 2,
												useGrouping: false,
											})}
										:
										{new Date(message.createdAt)
											.getMinutes()
											.toLocaleString("en-US", {
												minimumIntegerDigits: 2,
												useGrouping: false,
											})}
										:
										{new Date(message.createdAt)
											.getSeconds()
											.toLocaleString("en-US", {
												minimumIntegerDigits: 2,
												useGrouping: false,
											})}{" "}
										{parseInt(
											new Date(message.createdAt)
												.getHours()
												.toLocaleString("en-US", {
													minimumIntegerDigits: 2,
													useGrouping: false,
												})
										) <= 12
											? "AM"
											: "PM"}
									</p>
								</div>
							))
						) : (
							<h2
								style={{
									height: "100vh",
									display: "grid",
									placeContent: "center",
								}}>
								Send any text to start chat
							</h2>
						)}
					</main>

					<footer>
						<input type="text" placeholder="Type something..." ref={textRef} />

						<section className="buttons">
							<IoMdAttach />
							<button type="submit">Send</button>
						</section>
					</footer>
				</>
			)}
		</form>
	);
};

export default MainChats;
