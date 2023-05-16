import "../styles/FindFriends.css";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../config/firebaseConfig";

import { MdKeyboardBackspace } from "react-icons/md";

const FindFriend = () => {
	const { me, socket } = useContext(UserContext);

	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate("");

	const userId = me._id;

	const addFriend = async (friendId) => {
		try {
			const newUsers = users.filter((user) => user._id !== friendId);
			socket.emit("send-request", { to: friendId, from: userId });
			setUsers(newUsers);
			return setError("");
		} catch (error) {
			console.log(error.message);
		}
	};

	useEffect(() => {
		if (!me) return;
		const fetchUsers = async () => {
			const querySnapshot = await getDocs(collection(db, "users"));
			const fetchedUsers = [];

			querySnapshot.forEach((snap) => fetchedUsers.push(snap.data()));
			setUsers(fetchedUsers.filter((user) => user._id !== me._id));

			// const response = await api.get(`/users/${userId}`);
		};

		fetchUsers();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
