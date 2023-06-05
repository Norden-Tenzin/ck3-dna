import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
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
    fetchUserName();
    window.onclick = (event) => {
      if (isDropdownOpen == true && pillRef.current && !pillRef.current.contains(event.target)) {
        console.log("WRROOGN")
        setIsDropdownOpen(false);
      } else {
        console.log("WRIGNT")
        setIsDropdownOpen((isDropdownOpen) => !isDropdownOpen);
      }
    };
  }, [user, loading, isDropdownOpen]);

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
          <button
            className="navbar_button"
            onClick={() => {
              navigate("/login");
            }}
          >
            sign in
          </button>
          <button
            className="navbar_button"
            onClick={() => {
              navigate("/register");
            }}
          >
            sign up
          </button>
        </div>
      ) : (
        <div className="links">
          <div
            className="navbar_account_icon_container"
            onClick={() => {
              navigate("/upload");
            }}
          >
            <FiShare className="navbar_account_icon" />
          </div>

          <div ref={pillRef} className="navbar_pill" onClick={()=>{
            setIsDropdownOpen(true)
          }}>
            <div className="navbar_account_name">
              {name != "" ? `${name}` : "..."}
            </div>
            <div
              className={
                isDropdownOpen
                  ? "dropdown_content active_dropdown"
                  : "dropdown_content"
              }
            >
              <div
                className="dropdown_item"
                onClick={() => {
                  navigate(`/user/${userId}`);
                }}
              >
                Home
              </div>
              <div className="dropdown_item" onClick={logout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
