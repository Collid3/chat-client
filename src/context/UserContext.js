import React, { createContext, useEffect, useState } from "react";
import { protectedApi, api } from "../api/apiCall";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [me, setMe] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getUsers = async () => {
			// const users = await api.get("/users");

			setUsers([
				{
					uid: 1,
					username: "Seroba",
					hasAvatar: false,
					avatar: false,
				},
			]);

			setMe({
				username: "Collid3",
				hasAvatar: false,
				avatar: "",
				contacts: [
					{
						uid: 1,
						username: "Seroba",
						hasAvatar: false,
						avatar: false,
					},
				],
			});
		};

		getUsers();
	}, []);

	return <UserContext.Provider value={{ users, me }}>{children}</UserContext.Provider>;
};

export default UserContext;
