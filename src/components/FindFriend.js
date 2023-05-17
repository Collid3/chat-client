import "../styles/FindFriends.css";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";
import { useNavigate } from "react-router-dom";

import { MdKeyboardBackspace } from "react-icons/md";

const FindFriend = () => {
	const { me, socket, onlineUsers, setMe } = useContext(UserContext);

	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate("");

	const userId = me._id;

	const addFriend = async (friendId) => {
		try {
			const response = await api.post(`/requests/${friendId}`, {
				sender: userId,
				receiver: friendId,
			});

			const response1 = await api.post(`/requests/${userId}`, {
				sender: userId,
				receiver: friendId,
			});

			const friend = onlineUsers.find((user) => user.userId === friendId);
			if (friend) {
				console.log("sending request");
				socket.emit("send-request", {
					to: friend.socketId,
					updatedUser: response.data.user,
				});
			}
			setMe(response1.data.user);
			const newUsers = users.filter((user) => user._id !== friendId);
			setUsers(newUsers);
			return setError("");
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (!me) return;
		const fetchUsers = async () => {
			const response = await api.get(`/users/${userId}`);

			setUsers(
				response.data.users.filter(
					(user) =>
						user.requests.find(
							(request) => request.sender === me._id || request.receiver === me._id
						) === undefined
				)
			);
		};

		fetchUsers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [me]);

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

						<button onClick={() => addFriend(user._id)}>ADD</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FindFriend;
