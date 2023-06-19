import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory, useNavigate } from "react-router-dom";
// style
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../utils/firebase";
import "../style/Register.scss";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    console.log("REGISTER PAGE")
    if (loading) return;
    if (user) navigate("/ck3-dna/dashboard", { replace: true });
  }, [user, loading]);
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url("${process.env.PUBLIC_URL}/images/background.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="register-page"
    >
      <div className="register-space">
        <div className="register-container">
          <div className="register-title-container">
            <div className="title">Register</div>
            <button className="google-button" onClick={signInWithGoogle}>
              <img
                className="google-button-icon"
                src={process.env.PUBLIC_URL + "/google-color.svg"}
              />
              Register with google
            </button>
          </div>
          <div className="register-or">-OR-</div>
          <div className="register-fields-container">
            <input
              type="text"
              className="register-text-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            <input
              type="text"
              className="register-text-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
            <input
              type="password"
              className="register-text-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button className="register-button" onClick={register}>
              Register
            </button>
            <div>
              Already have an account? <Link to="/ck3-dna/">Login</Link> now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
