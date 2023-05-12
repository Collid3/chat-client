import "../styles/Home.css";
import React from "react";
import Sidebar from "../components/Sidebar";
import MainChats from "../components/MainChats";

const Home = () => {
	return (
		<main className="home-container">
			<Sidebar />
			<MainChats />
		</main>
	);
};

export default Home;
