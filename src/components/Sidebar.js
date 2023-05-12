import React, { useContext } from "react";
import UserContext from "../context/UserContext";

const Sidebar = () => {
	const { users, me } = useContext(UserContext);
	const contactsList = users.filter((user) =>
		me.contacts.find((friend) => friend.username === user.username)
	);

	console.log(me);

	return (
		<div className="sidebar-container">
			<h1>Chats</h1>

			<ul className="sidebar-contacts-container">
				{contactsList.map((user) => (
					<li className="contact" key={user.uid}>
						<h4>{user.username}</h4>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
