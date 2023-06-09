import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
// style
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../utils/firebase";
import "../style/Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/ck3-dna/");
  }, [user, loading]);
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url("${process.env.PUBLIC_URL}/images/background.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="login-page"
    >
      <div className="login-space">
        <div className="login-container">
          <div className="login-title-container">
            <div className="title">Login</div>
            <button className="google-button" onClick={signInWithGoogle}>
              <img
                className="google-button-icon"
                src={process.env.PUBLIC_URL + "/google-color.svg"}
              />
              Login with google
            </button>
          </div>
          <div className="login-or">-OR-</div>
          <div className="login-fields-container">
            <input
              type="text"
              className="login-text-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
            <input
              type="password"
              className="login-text-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              className="login-button"
              onClick={() => logInWithEmailAndPassword(email, password)}
            >
              Login
            </button>
            <div>
              <Link to="/ck3-dna/reset">Forgot Password</Link>
            </div>
            <div>
              Don't have an account?{" "}
              <Link to="/ck3-dna/register">Register</Link> now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
