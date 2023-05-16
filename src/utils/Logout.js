import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default async function Logout(setMe) {
	await signOut(auth);
	setMe(null);
}
