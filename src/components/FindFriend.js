import "../styles/FindFriends.css";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import loader from "../assets/loader.gif";

const FindFriend = () => {
	const { me, socket, onlineUsers, setMe, contacts, sidebar, setSidebar } =
		useContext(UserContext);

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
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
				socket.emit("send-request", {
					to: friend.socketId,
					updatedUser: response.data.user,
				});
			}
			setMe(response1.data.user);
			const newUsers = users.filter((user) => user._id !== friendId);
			setUsers(newUsers);
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (!me) return setLoading(false);

		const fetchUsers = async () => {
			const response = await api.get(`/users/${userId}`);
			const contactsResponse = await api.get(`/users/contacts/${me._id}`);
			const myContacts = contactsResponse.data.users;

			setUsers(
				response.data.users.filter(
					(user) =>
						user.requests.find(
							(request) => request.sender === me._id || request.receiver === me._id
						) === undefined &&
						myContacts.find((contact) => contact._id === user._id) === undefined
				)
			);

			setLoading(false);
		};

		fetchUsers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [me.requests, contacts]);

	return (
		<div className={`sidebar find-friends-container  ${sidebar && "active"}`}>
			<h1>Find Friends</h1>

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

			{!loading && (
				<>
					<ul className="friends-container">
						<input
							type="text"
							placeholder="Search contact"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>

						{users
							.filter((user) => user.username.includes(search))
							.map((user) => (
								<li className="contact" key={user._id}>
									<h3>{user.username}</h3>

									<button onClick={() => addFriend(user._id)}>ADD</button>
								</li>
							))}

						{users.length === 0 && <h4>No contacts to add</h4>}

						{users.length > 0 &&
							users.filter((user) => user.username.includes(search)).length === 0 && (
								<h2
									style={{
										flexGrow: 2,
										display: "grid",
										placeContent: "center",
									}}>
									No user found by the name '{search}'
								</h2>
							)}
					</ul>
				</>
			)}

			{loading && (
				<div className="sidebar-loading-page">
					<img src={loader} alt="Loading..." />
				</div>
			)}
		</div>
	);
};

export default FindFriend;
