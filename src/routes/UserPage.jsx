import React, { useEffect, useState } from "react";
import CardPage from "../components/CardPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db, logout } from "../utils/firebase";
// style
import "../style/UserPage.scss";
// internal
import NavBar from "../components/NavBar";

export default function UserPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState("");
  const [isMyPage, setIsMyPage] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const uid = params.uid;

  const fetchUserId = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      return data.uid;
    } catch (error) {
      console.log(
        "%cerror UserPage.jsx line:21 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  useEffect(() => {
    if (loading) return;
    // if not logged in send to login page
    if (!user) return navigate("/");
    fetchUserId().then((id) => {
      console.log(id, uid);
      if (id == uid) {
        setIsMyPage(true);
        setUserId(id);
      } else {
        setUserId(uid);
      }
      console.log(userId);
    });
  }, [user, loading]);

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        <div className="page_items">
          <div className="user_data">
            <p className="user_name">UserName</p>
            <p className="user_desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
              ratione alias beatae nam, sit dicta soluta voluptatibus itaque!
              Temporibus voluptates at nostrum dicta cumque maiores eius
              provident error officia praesentium.
            </p>
          </div>
          <div className="user_cards">
            {userId !== "" ? (
              <CardPage fieldName="authorId" condition="==" query={userId} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
