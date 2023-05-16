import "../styles/auth.css";
import React, { useContext, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import { api } from "../api/apiCall";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const Login = () => {
	const { setMe, me } = useContext(UserContext);

	const inputs = {
		username: useRef(""),
		password: useRef(""),
	};
	const [error, setError] = useState("");

	const handleLogin = async () => {
		if (inputs.username.current.value === "" || inputs.password.current.value === "") {
			return setError("Username and password required");
		}

		const response = await api.get(`/users/${inputs.username.current.value}`);
		const email = response.data.user.email;

		// const docRef = doc(db, "users", me._id);

		await signInWithEmailAndPassword(auth, email, inputs.password.current.value);
	};

	return (
		<div className="auth-container">
			<h1>Login</h1>

			<form className="auth-form" onSubmit={(e) => e.preventDefault()}>
				{error && (
					<p
						style={{
							backgroundColor: "red",
							padding: "5px",
							textAlign: "center",
							borderRadius: "10px",
							transition: "ease-in .5s",
						}}>
						{error}
					</p>
				)}

				<input type="text" placeholder="Username" ref={inputs.username} />
				<input type="password" placeholder="Password" ref={inputs.password} />

				<button type="submit" onClick={handleLogin}>
					Login
				</button>

				<button>Forgot Password</button>

				<p>
					Dont have an account?{" "}
					<span>
						<Link to="/register">Create account</Link>{" "}
					</span>{" "}
				</p>
			</form>
		</div>
	);
};

export default Login;
