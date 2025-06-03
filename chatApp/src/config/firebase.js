import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getAuth,signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyAW-HC7UEFvZ74yu_KBOMVh95XD8WOQy_w",
  authDomain: "chat-app-4b9b2.firebaseapp.com",
  projectId: "chat-app-4b9b2",
  storageBucket: "chat-app-4b9b2.firebasestorage.app",
  messagingSenderId: "320195238600",
  appId: "1:320195238600:web:f2bdd27309d0c5d1d123fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
      const res= await createUserWithEmailAndPassword(auth,email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username:username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Hey there! I am using Chat App",
        lastSeen: Date.now(),
      });
      await setDoc(doc(db, "chats", user.uid), {
        chatsData: [],
      });
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const resetPassword = async (email) => {
  if(!email) {
    toast.error("Please enter your email");
    return null;
  }
  try {
    const userRef = collection(db, "users")
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     await sendPasswordResetEmail(auth, email);
      toast.success("reset email sent successfully");
    }
    else{
      toast.error('email does not exist')
    }
  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
}

export {signup, login, logout, auth, db, resetPassword}