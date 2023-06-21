import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
// style
import "../style/UserPage.scss";
// internal
import { auth, db, logout } from "../utils/firebase";
import CardPage from "../components/CardPage";
import NavBar from "../components/NavBar";

export default function UserPage() {
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [isMyPage, setIsMyPage] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const uid = params.uid;

  useEffect(() => {
    console.log("USER PAGE");
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", params?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      if (data.id == uid) {
        setIsMyPage(true);
        setUserId(data.id);
        setUserName(data.name);
      } else {
        setUserId(uid);
        setUserName(data.name);
      }
    } catch (error) {
      console.log(
        "%cerror UserPage.jsx line:21 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        <div className="page_grid_container">
          <div className="page_grid">
            <div className="user_data">
              <p className="user_name">{userName}</p>
              <p className="user_desc">{userDesc}</p>
            </div>
            <div className="user_cards">
              {userId !== "" ? (
                <CardPage
                  fieldName="authorId"
                  myWhere={[where("authorId", "==", userId)]}
                  dropdown={true}
                  dropdownType="user"
                  at={user?? ""}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
