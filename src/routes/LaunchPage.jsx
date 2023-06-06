import React, { useEffect, useState } from "react";
import CardPage from "../components/CardPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
// style
import "../style/LaunchPage.scss";
// internal
import { auth, db, logout } from "../utils/firebase";
import NavBar from "../components/NavBar";

export default function UserPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState("");
  const [isMyPage, setIsMyPage] = useState(false);
  const [childHeight, setChildHeight] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    console.log(
      "%cCardPage.jsx line:39 scrollTop",
      "color: #007acc;",
      scrollTop
    );
    console.log(
      "%cCardPage.jsx line:40 scrollHeight",
      "color: #007acc;",
      scrollHeight
    );
    console.log(
      "%cCardPage.jsx line:41 clientHeight",
      "color: #007acc;",
      clientHeight
    );
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("SCROLLED TO BOTTOM");
    }
    // if (!areMore) {
    //   window.removeEventListener("scroll", handleScroll);
    // }
  };
  useEffect(() => {
    if (loading) return;
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        <div className="page_grid_container">
          <div className="page_grid">
            <div className="page_data">
              <p className="page_name">UserName</p>
              <p className="page_desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                ratione alias beatae nam, sit dicta soluta voluptatibus itaque!
                Temporibus voluptates at nostrum dicta cumque maiores eius
                provident error officia praesentium.
              </p>
            </div>
            <div className="page_cards">
              <CardPage
                className="card-page"
                fieldName="modList"
                condition="array-contains-any"
                query={["epe", "cfp"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
