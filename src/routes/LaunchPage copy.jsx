import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../utils/firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";
// style
import "../style/LaunchPage.scss";
// internal
import CardPage from "../components/CardPage";
import NavBar from "../components/NavBar";

function LaunchPage() {
  const [index, setIndex] = useState(0);

  return (
    <div className="launch-page">
      <NavBar />
      <div className="tabs">
        <div
          onClick={() => {
            setIndex(0);
          }}
          className={`${index === 0 ? "tab active-tab" : "tab"}`}
        >
          <div className="tab-title">Tab1</div>
        </div>
        <div
          onClick={() => {
            setIndex(1);
          }}
          className={`${index === 1 ? "tab active-tab" : "tab"}`}
        >
          <div className="tab-title">Tab2</div>
        </div>
        <div
        onClick={() => {
            setIndex(2);
          }}
          className={`${index === 2 ? "tab active-tab" : "tab"}`}
        >
          <div className="tab-title">Tab3</div>
        </div>
      </div>
      <div className="contents">
        <div
          className={`${index === 0 ? "content active-content" : "content"}`}
        >
          <CardPage
            className="card-page"
            fieldName="modList"
            condition="array-contains-any"
            query={["epe", "cfp"]}
          />
        </div>
        <div
          className={`${index === 1 ? "content active-content" : "content"}`}
        >
          <div>Content2</div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            nihil nemo voluptates, reprehenderit ea ipsam impedit pariatur
            voluptatum dolor est cupiditate perspiciatis consectetur facere,
            neque excepturi debitis possimus ratione deleniti.
          </div>
        </div>
        <div
          className={`${index === 2 ? "content active-content" : "content"}`}
        >
          <div>Content3</div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            nihil nemo voluptates, reprehenderit ea ipsam impedit pariatur
            voluptatum dolor est cupiditate perspiciatis consectetur facere,
            neque excepturi debitis possimus ratione deleniti.
          </div>
        </div>
      </div>
    </div>
  );
}
export default LaunchPage;
