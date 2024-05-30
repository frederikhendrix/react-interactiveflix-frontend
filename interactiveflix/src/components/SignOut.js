import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./signout.css";

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the login page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
