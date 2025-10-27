// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tracks if Firebase has finished checking the session // 1. Register

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }; // 2. Login

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }; // 3. Logout

  const logOut = () => {
    return signOut(auth);
  }; // 4. State Listener (Runs once on mount & on auth state change)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Authentication state is now known (user is logged in or null)
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const contextValue = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
  };

  return (
    <UserContext.Provider value={contextValue}>
           {" "}
      {/* CRITICAL FIX: ALWAYS render children. We will use the 'loading' state
          in App.js or Dashboard to show a spinner instead. */}
            {children}   {" "}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
