import React, { useContext, useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import UserContext from "../context/UserContext";

const Register = () => {
	const { setMe } = useContext(UserContext);

	const [error, setError] = useState("");
	const inputs = {
		email: useRef(""),
		username: useRef(""),
		password: useRef(""),
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			inputs.username.current.value === "" ||
			inputs.password.current.value === "" ||
			!inputs.email.current.value === ""
		) {
			return setError("Email, username and password required");
		}

		// eslint-disable-next-line no-useless-escape
		const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

		if (format.test(inputs.username.current.value)) {
			return setError("No special characters allowed in a username");
		} else if (inputs.username.current.value.split(" ").length > 1) {
			return setError("Username should not have spaces or special characters");
		}

		try {
			const q = await query(
				collection(db, "users"),
				where("username", "==", inputs.username.current.value)
			);

			const docRef = await getDocs(q);

			let User = "";
			docRef.forEach((doc) => (User = doc.data()));

			if (User.username === inputs.username.current.value) {
				return setError("Username or email already exists");
			}

			await createUserWithEmailAndPassword(
				auth,
				inputs.email.current.value,
				inputs.password.current.value
			);

			await updateProfile(auth.currentUser, {
				displayName: inputs.username.current.value,
			});

			// 			const imageName = !imageUpload ? "noProfile" : imageUpload.name + uuid;
			//
			// 			if (!imageUpload) {
			// 				await updateProfile(auth.currentUser, {
			// 					photoURL: imageName,
			// 				});
			// 			} else {
			// 				const imageRef = ref(storage, `/profilePictures/${imageName}`);
			// 				await uploadBytes(imageRef, imageUpload);
			// 				const url = await getDownloadURL(imageRef);
			// 				await updateProfile(auth.currentUser, {
			// 					photoURL: url,
			// 				});
			// 			}

			await addDoc(collection(db, "users"), {
				_id: auth.currentUser.uid,
				username: auth.currentUser.displayName,
				email: auth.currentUser.email,
				// imageUrl: auth.currentUser.photoURL,
				// imageName: imageName,
				requests: [],
				// friends: [],
				// chatRooms: [],
			});

			setMe({
				_id: auth.currentUser.uid,
				username: auth.currentUser.displayName,
				requests: [],
			});
		} catch (err) {
			console.log(err.message);
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

				<input type="text" placeholder="email Address" ref={inputs.email} />
				<input type="text" placeholder="Username" ref={inputs.username} />
				<input type="password" placeholder="Password" ref={inputs.password} />

				<button type="submit">Login</button>
				<button>Forgot Password</button>
			</form>
		</div>
	);
};

export default Register;
