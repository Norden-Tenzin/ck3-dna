import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// style
import { auth, sendPasswordReset } from "../utils/firebase";
import "../style/Reset.scss";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/ck3-dna/dashboard");
  }, [user, loading]);
  return (
    <div className="reset">
      <div className="container">
        <input
          type="text"
          className="textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          className="btn"
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link to="/ck3-dna/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Reset;