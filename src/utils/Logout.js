import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default async function Logout(setMe, socket) {
  await signOut(auth);
  socket.emit("logout");
  setMe(null);
}
