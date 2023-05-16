import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDOHXeg5gcR1UUKiilzXkKPCPk-EFwn31U",
	authDomain: "chat-app-46af0.firebaseapp.com",
	projectId: "chat-app-46af0",
	storageBucket: "chat-app-46af0.appspot.com",
	messagingSenderId: "917075175293",
	appId: "1:917075175293:web:b9abf4d92d22c962b38e14",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
