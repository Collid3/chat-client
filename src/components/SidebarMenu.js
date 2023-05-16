import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../utils/Logout";

const SidebarMenu = ({ setMe }) => {
	const navigate = useNavigate();

	return (
		<ul className="sidebar-menu-container">
			<li>Profile</li>
			<li onClick={() => navigate("/find-friends")}>Find Friends</li>
			<li onClick={() => Logout(setMe)}>Logout</li>
		</ul>
	);
};

export default SidebarMenu;
