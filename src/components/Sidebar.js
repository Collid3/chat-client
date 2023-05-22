import "../styles/sidebar.css";
import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import SidebarMenu from "./SidebarMenu";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

const Sidebar = () => {
	const { contacts, me, setSelectedChat, setMe, sidebar, setSidebar } = useContext(UserContext);
	const [menu, setMenu] = useState(false);
	const [search, setSearch] = useState("");

	return (
		<div className={`sidebar sidebar-container ${sidebar && "active"}`}>
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
				<input
					type="text"
					placeholder="Search contact"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				{contacts
					.filter((user) => user.username.includes(search))
					.map((user) => (
						<li
							className="contact"
							key={user._id}
							onClick={() => {
								setSelectedChat(user);
								setSidebar(false);
							}}>
							<div>
								<h4>{user.username}</h4>

								<p>{user.lastMessage?.text}</p>
							</div>

							<div>
								<h4>{user.isOnline ? "Online" : "Offline"}</h4>

								<p>
									{new Date(user.lastMessage?.createdAt)
										.getHours()
										.toLocaleString("en-US", {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})}
									:
									{new Date(user.lastMessage?.createdAt)
										.getMinutes()
										.toLocaleString("en-US", {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})}{" "}
									{parseInt(new Date(user.lastMessage?.createdAt).getHours()) >=
									12
										? "PM"
										: "AM"}
								</p>
							</div>
						</li>
					))}

				{contacts.length === 0 && (
					<h2 style={{ flexGrow: 2, display: "grid", placeContent: "center" }}>
						No friends to chat to. Invite <Link to="/find-friends">Friends</Link>
					</h2>
				)}

				{contacts.filter((user) => user.username.includes(search)).length === 0 && (
					<h2 style={{ flexGrow: 2, display: "grid", placeContent: "center" }}>
						No contact found for the name '{search}'
					</h2>
				)}
			</ul>
		</div>
	);
};

export default Sidebar;
