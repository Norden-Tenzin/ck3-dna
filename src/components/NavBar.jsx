import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
// import { FaFileUpload, FaPlus } from "react-icons/fa";
import { FiPlus, FiShare } from "react-icons/fi";
// style
import "../style/NavBar.scss";
// internal
import { auth, db, logout } from "../utils/firebase";

export default function NavBar() {
  const [user, loading, error] = useAuthState(auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const pillRef = useRef();
  const menuItems = [
    {
      title: "Home",
      url: "/user",
    },
    {
      title: "logout",
      url: "/services",
    },
  ];
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setUserId(data.uid);
    } catch (error) {
      console.log(
        "%cerror Dashboard.jsx line:23 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    window.onclick = (event) => {
      if (pillRef.current && !pillRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      } else {
        setIsDropdownOpen((isDropdownOpen) => !isDropdownOpen);
      }
    };
  }, [user, loading]);

  return (
    <div className="navbar">
      <div
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        BRAND
      </div>
      {!user ? (
        <div className="links">
          <button>Signin</button>
          <button>signup</button>
        </div>
      ) : (
        <div className="links">
          {/* <button>Publish</button>
        <button>Sign In</button> */}
          <div
            className="navbar-account-icon-container"
            onClick={() => {
              navigate("/upload");
            }}
          >
            <FiShare className="navbar-account-icon" />
          </div>

          <div ref={pillRef} className="navbar-pill">
            <div className="navbar-account-name">
              {name != "" ? name.toLowerCase() : "..."}
            </div>
            <img
              src={process.env.PUBLIC_URL + "/images/portrait.jpg"}
              className="navbar-account-image"
            />
            <div
              className={
                isDropdownOpen
                  ? "dropdown-content active-dropdown"
                  : "dropdown-content"
              }
            >
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate(`/user/${userId}`);
                }}
              >
                Home
              </div>
              <div className="dropdown-item" onClick={logout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
