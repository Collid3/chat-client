import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../utils/Logout";

const SidebarMenu = ({ setMe, me }) => {
	const navigate = useNavigate();
	const requests = me.requests.filter((request) => request.sender !== me._id);

	console.log(me.requests);

	return (
		<ul className="menu-container sidebar-menu-container">
			<li>Profile</li>
			<li onClick={() => navigate("/requests")}>
				Requests {requests.length > 0 && <span>{requests.length}</span>}
			</li>
			<li onClick={() => navigate("/find-friends")}>Find Friends</li>
			<li onClick={() => Logout(setMe)}>Logout</li>
		</ul>
	);
};

export default SidebarMenu;
