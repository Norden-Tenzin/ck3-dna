import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./style/LaunchPage.css";
import { auth, db, logout } from "../utils/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import CardPage from "./CardPage"

function LaunchPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="launch-page">
      <div className="navbar">
        <button>Publish</button>
        <button>Sign In</button>
      </div>
      <div className="tabs">
        <div
          onClick={() => {
            setIndex(0);
          }}
          className={`${index === 0 ? "tab active-tab" : "tab"}`}
        >
          tab1
        </div>
        <div
          onClick={() => {
            setIndex(1);
          }}
          className={`${index === 1 ? "tab active-tab" : "tab"}`}
        >
          tab2
        </div>
        <div
          onClick={() => {
            setIndex(2);
          }}
          className={`${index === 2 ? "tab active-tab" : "tab"}`}
        >
          tab3
        </div>
      </div>

      <div className="contents">
        <div
          className={`${index === 0 ? "content active-content" : "content"}`}
        >
          <CardPage/>
        </div>
        <div
          className={`${index === 1 ? "content active-content" : "content"}`}
        >
          <h1>Content2</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            nihil nemo voluptates, reprehenderit ea ipsam impedit pariatur
            voluptatum dolor est cupiditate perspiciatis consectetur facere,
            neque excepturi debitis possimus ratione deleniti.
          </p>
        </div>
        <div
          className={`${index === 2 ? "content active-content" : "content"}`}
        >
          <h1>Content3</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            nihil nemo voluptates, reprehenderit ea ipsam impedit pariatur
            voluptatum dolor est cupiditate perspiciatis consectetur facere,
            neque excepturi debitis possimus ratione deleniti.
          </p>
        </div>
      </div>
    </div>
  );
}
export default LaunchPage;
