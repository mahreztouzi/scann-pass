import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "../../firebaseBaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import { getStorage, getDownloadURL } from "firebase/storage";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  setDoc,
  getDoc,
  updateDoc,
  getDownloadURL,
  onAuthStateChanged,
  addDoc,
  getDocs,
  deleteDoc,
};

//Inscription
export const signupUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

//connexion
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//deconnexion
export const logoutUser = () => {
  return signOut(auth);
};

export function useAuth() {
  const [authUser, authLoading, error] = useAuthState(auth);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const ref = doc(db, "Users", authUser.uid);
      const docSnap = await getDoc(ref);
      setUser(docSnap.data());
      setLoading(false);
    }

    if (!authLoading) {
      if (authUser) fetchData();
      else setLoading(false);
    }
  }, [authUser, authLoading]);
  return { user, isLoading, error };
}

export function CurrentUser() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user.uid);
    });

    return unsubscribe;
  }, []);
  return currentUser;
}
