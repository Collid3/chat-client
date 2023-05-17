import "../styles/Home.css";
import React from "react";
import Sidebar from "../components/Sidebar";
import MainChats from "../components/MainChats";
import FindFriend from "../components/FindFriend";
import { Navigate, Route, Routes } from "react-router-dom";
import Requests from "../components/Requests";

const Home = () => {
	return (
		<main className="home-container">
			<Routes>
				<Route path="/*" element={<Navigate to="/" replace />} />
				<Route path="/" element={<Sidebar />} />
				<Route path="/find-friends" element={<FindFriend />} />
				<Route path="/requests" element={<Requests />} />
			</Routes>
			<MainChats />
		</main>
	);
};

export default Home;
