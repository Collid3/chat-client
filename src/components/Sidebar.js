import "../styles/sidebar.css";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import SidebarMenu from "./SidebarMenu";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const Sidebar = () => {
	const { contacts, me, setSelectedChat, setMe } = useContext(UserContext);
	const [menu, setMenu] = useState(false);

	return (
		<div className="sidebar-container active">
			<section>
				<h2>{me.username}</h2>

				{!menu ? (
					<div className="closed-menu-container">
						<FiMenu onClick={() => setMenu(true)} />
						{me.requests.filter((request) => request.sender !== me._id).length > 0 && (
							<p>
								{me.requests.filter((request) => request.sender !== me._id).length}
							</p>
						)}
					</div>
				) : (
					<RxCross2 onClick={() => setMenu(false)} />
				)}

				{menu && <SidebarMenu setMe={setMe} me={me} />}
			</section>

			<ul className="sidebar-contacts-container">
				{contacts.map((user) => (
					<li className="contact" key={user._id} onClick={() => setSelectedChat(user)}>
						<h4>{user.username}</h4>

						<p>{user.isOnline ? "Online" : "Offline"}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
