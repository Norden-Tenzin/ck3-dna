import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { FiPlus, FiShare } from "react-icons/fi";
// style
import "../style/NavBar.scss";
// internal
import { auth, db, logout } from "../utils/firebase";
import { Dropdown } from "./Dropdown";

export default function NavBar() {
  const [user, loading, error] = useAuthState(auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [location, setLocation] = useState([
    {
      id: 0,
      title: "New York",
      selected: false,
      key: "location",
    },
    {
      id: 1,
      title: "Dublin",
      selected: false,
      key: "location",
    },
    {
      id: 2,
      title: "California",
      selected: false,
      key: "location",
    },
    {
      id: 3,
      title: "Istanbul",
      selected: false,
      key: "location",
    },
    {
      id: 4,
      title: "Izmir",
      selected: false,
      key: "location",
    },
    {
      id: 5,
      title: "Oslo",
      selected: false,
      key: "location",
    },
  ]);

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
  }, [user, loading]);

  return (
    <div className="navbar">
      <div
        className="logo"
        onClick={() => {
          navigate("/ck3-dna/");
        }}
      >
        CK3-DNA
      </div>
      {!user ? (
        <div className="links">
          <button
            className="navbar_button"
            onClick={() => {
              navigate("/ck3-dna/login");
            }}
          >
            sign in
          </button>
          <button
            className="navbar_button"
            onClick={() => {
              navigate("/ck3-dna/register");
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
              navigate("/ck3-dna/upload");
            }}
          >
            <FiShare className="navbar_account_icon" />
          </div>
          <Dropdown title={name != "" ? `${name}` : "..."} >
            <DropdownMenu />
          </Dropdown>
        </div>
      )}
    </div>
  );

  function DropdownMenu(props) {
    function DropdownItem(props) {
      return (
        <div className="dd-list-item" onClick={props.onClick}>
          {props.children}
        </div>
      );
    }
    return (
      <div className="dd-list">
        <DropdownItem
          onClick={() => {
            // console.log("HOME");
            navigate(`/ck3-dna/user/${userId}`);
          }}
        >
          Home
        </DropdownItem>
        <DropdownItem onClick={logout}>Logout</DropdownItem>
      </div>
    );
  }
}
