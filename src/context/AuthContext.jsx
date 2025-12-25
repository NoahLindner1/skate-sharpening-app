import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import {onAuthStateChanged, signInWithEmailAndPassword,signOut} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // restore store from localStorage
      const savedStore = localStorage.getItem("store");
      if (firebaseUser && savedStore) {
        setStore(savedStore);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

// 🔐 Login
const login = async (email, password, selectedStore) => {
  if (!selectedStore) {
    throw new Error("Store must be selected");
  }

  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 🔒 CREATE / UPDATE USER DOC (THIS IS THE FIX)
  await setDoc(
    doc(db, "users", result.user.uid),
    {
      email: result.user.email,
      store: selectedStore,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  // Persist store locally for refreshes
  localStorage.setItem("store", selectedStore);
  setStore(selectedStore);
  setUser(result.user);
};


  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("store");
    setStore(null);
    setUser(null);
  };

  const value = {
    user,
    store,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
