import React, { useContext, useEffect, useState } from "react";
import { api } from "../api/apiCall";
import UserContext from "../context/UserContext";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Requests = () => {
	const { me, socket, onlineUsers, setMe, setContacts, sidebar, setSidebar } =
		useContext(UserContext);

	const [users, setUsers] = useState([]);
	const navigate = useNavigate("");

	const userId = me._id;

	useEffect(() => {
		if (!me) return;
		const fetchUsers = async () => {
			const response = await api.get(`/users/${userId}`);

			setUsers(
				response.data.users.filter(
					(user) =>
						user.requests.find((request) => request.receiver === userId) !== undefined
				)
			);
		};

		fetchUsers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [me.requests]);

	const replyRequest = async (accept, friendId) => {
		const friend = onlineUsers.find((user) => user.userId === friendId);

		const friendResponse = await api.put(`/requests/${friendId}`, {
			sender: friendId,
			receiver: me._id,
		});

		const response = await api.put(`/requests/${userId}`, {
			sender: friendId,
			receiver: me._id,
		});

		if (!accept) {
			socket.emit("reject-request", {
				to: friend.socketId,
				me: friendResponse.data.user,
				friend: response.data.user,
			});
		}

		if (accept) {
			await api.post("/messageRoom", { senderId: friendId, receiverId: me._id });

			// add friend to contacts
			if (
				onlineUsers.find((user) => user.userId === friendResponse.data.user._id) ===
				undefined
			) {
				setContacts((prev) => [...prev, { ...friendResponse.data.user }]);
			} else {
				setContacts((prev) => [...prev, { ...friendResponse.data.user, isOnline: true }]);
			}

			// update friend if they are online
			if (friend) {
				socket.emit("accept-request", {
					to: friend.socketId,
					me: friendResponse.data.user,
					friend: response.data.user,
				});
			}
		}

		const newUsers = users.filter(
			(user) => user.requests.find((request) => request.sender === friendId) === undefined
		);

		setMe(response.data.user);

		setUsers(newUsers);
	};

	return (
		<div className={`sidebar find-friends-container ${sidebar && "active"}`}>
			<h1>Friend Requests</h1>

			<br />

			<section>
				<h2>{me.username}</h2>

				<MdKeyboardBackspace
					onClick={() => {
						setSidebar(true);
						navigate("/");
					}}
				/>
			</section>

			<ul className="friends-container">
				{users.map((user) => (
					<li className="contact" key={user._id}>
						<h3>{user.username}</h3>

						<button onClick={() => replyRequest(true, user._id)}>Accept</button>
						<button onClick={() => replyRequest(false, user._id)}>Reject</button>
					</li>
				))}

				{users.length === 0 && <h4>No contacts to add</h4>}
			</ul>
		</div>
	);
};

export default Requests;
