import "../styles/Home.css";
import React from "react";
import Sidebar from "../components/Sidebar";
import MainChats from "../components/MainChats";
import FindFriend from "./FindFriend";
import { Navigate, Route, Routes } from "react-router-dom";

const Home = () => {
	return (
		<main className="home-container">
			<Routes>
				<Route path="/*" element={<Navigate to="/" replace />} />
				<Route path="/" element={<Sidebar />} />
				<Route path="/find-friends" element={<FindFriend />} />
			</Routes>
			<MainChats />
		</main>
	);
};

export default Home;
