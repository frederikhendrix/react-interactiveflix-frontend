import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in with email and password:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="maindivlogin">
      <div className="interactiveFlix-logo">InteractiveFlix</div>
      <form className="formLogin" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign in</button>
      </form>
      <div className="otherLogin">
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;
