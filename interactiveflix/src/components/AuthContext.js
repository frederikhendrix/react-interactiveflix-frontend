import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const providerId = user.providerData[0].providerId;
        if (providerId === "google.com") {
          setRole("Admin");
        } else if (providerId === "password") {
          setRole("User");
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Define PropTypes for the component
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
