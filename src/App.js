import "./App.css";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
	const { me } = useContext(UserContext);

	console.log(me);

	return (
		<div className="App">
			{me ? (
				<Home />
			) : (
				<Routes>
					<>
						<Route path="/*" element={<Navigate to="/" replace />} />
						<Route path="/" element={<Login />} />
						<Route path="register" element={<Register />} />
					</>
				</Routes>
			)}
		</div>
	);
}

export default App;
