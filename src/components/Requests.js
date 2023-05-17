import React, { useContext, useEffect, useState } from "react";
import { api } from "../api/apiCall";
import UserContext from "../context/UserContext";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Requests = () => {
	const { me, socket, onlineUsers, setMe } = useContext(UserContext);

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
	}, []);

	const replyRequest = async (accept, friendId) => {
		if (accept) {
			// when we accept the request and updating us
			// sender shoud be our friend and we should be the receiver

			// when we sent the request and it is being accepted
			// we should be the sender and the friend should be the receiver

			await api.post("/messageRoom", { senderId: friendId, receiverId: me._id });
		}

		const response = await api.put(`/requests/${me._id}`, {
			sender: friendId,
			reciever: me._id,
		});

		const friendResponse = await api.put(`/requests/${friendId}`, {
			sender: friendId,
			receiver: me._id,
		});

		// update if they are online
		const friend = onlineUsers.find((user) => user.userId === friendId);
		console.log(friend);

		if (friend) {
			socket.emit("accept-request", { to: friend.socketId, me: friendResponse.data.user });
		}

		const newUsers = users.filter(
			(user) => user.requests.find((request) => request.sender === friendId) === undefined
		);

		setMe(response.data.user);

		setUsers(newUsers);
	};

	return (
		<div className="find-friends-container">
			<h1>Find Friends</h1>

			<br />

			<section>
				<h2>{me.username}</h2>

				<MdKeyboardBackspace onClick={() => navigate("/")} />
			</section>

			<ul className="friends-container">
				{users.map((user) => (
					<li className="contact" key={user._id}>
						<h3>{user.username}</h3>

						<button onClick={() => replyRequest(true, user._id)}>Accept</button>
						<button onClick={() => replyRequest(false, user._id)}>Reject</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Requests;
