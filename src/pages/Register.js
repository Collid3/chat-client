import React, { useContext, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Link } from "react-router-dom";
import { api } from "../api/apiCall";
import { BsEyeFill } from "react-icons/bs";

const Register = () => {
	const { setMe } = useContext(UserContext);

	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const inputs = {
		email: useRef(""),
		username: useRef(""),
		password: useRef(""),
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			inputs.email.current.value === "" ||
			inputs.username.current.value === "" ||
			inputs.password.current.value === ""
		) {
			return setError("Email, username and password are required");
		}

		if (inputs.password.current.value.length < 6) {
			return setError("Password too short. Must be a minimum of 6 characters");
		}

		// check for spaces and special characters in username
		// eslint-disable-next-line no-useless-escape
		const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;

		if (format.test(inputs.username.current.value)) {
			return setError("Only _ and - special characters can be used in a username");
		} else if (inputs.username.current.value.split(" ").length > 1) {
			return setError("Spaces are not allowed in a username");
		}

		try {
			const newUser = {
				email: inputs.email.current.value,
				username: inputs.username.current.value,
				hasAvatar: false,
				avatar: "none",
				isOnline: false,
				requests: [],
			};

			// save to mongoDB
			await api.post("/users", newUser);

			// create account on firebase
			await createUserWithEmailAndPassword(
				auth,
				inputs.email.current.value,
				inputs.password.current.value
			).then(async (userCred) => {
				await updateProfile(auth.currentUser, {
					displayName: userCred.user.displayName,
				});
			});
		} catch (err) {
			// eslint-disable-next-line default-case
			switch (err.message) {
				case "Firebase: Error (auth/invalid-email).":
					setError("Invalid Email address");
					break;

				case "Firebase: Password should be at least 6 characters (auth/weak-password).":
					setError("Password too short. Must be a minimum of 6 characters");
					break;

				case "Firebase: Error (auth/email-already-in-use).":
					setError("Username or email already exists");
			}
		}
	};

	return (
		<div className="auth-container">
			<h1>Register</h1>

			<form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
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

				<input
					type="email"
					placeholder="Email Address"
					ref={inputs.email}
					spellCheck={false}
				/>
				<input type="text" placeholder="Username" ref={inputs.username} />

				<section>
					<BsEyeFill onClick={() => setShowPassword(!showPassword)} />
					<input
						type={`${showPassword ? "text" : "password"}`}
						placeholder="Password"
						ref={inputs.password}
					/>
				</section>

				<button type="submit">Register</button>

				<p>
					Already have an account?{" "}
					<span>
						<Link to="/login">Login</Link>{" "}
					</span>{" "}
				</p>
			</form>
		</div>
	);
};

export default Register;
