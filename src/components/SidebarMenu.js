import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../utils/Logout";

const SidebarMenu = ({ setMe, me, socket }) => {
	const navigate = useNavigate();
	const requests = me.requests.filter((request) => request.sender !== me._id);

	return (
		<ul className="menu-container sidebar-menu-container">
			<li>Profile</li>
			<li onClick={() => navigate("/requests")}>
				Requests {requests.length > 0 && <span>{requests.length}</span>}
			</li>
			<li onClick={() => navigate("/find-friends")}>Find Friends</li>
			<li onClick={() => Logout(setMe, socket)}>Logout</li>
		</ul>
	);
};

export default SidebarMenu;
