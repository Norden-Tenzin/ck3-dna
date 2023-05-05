import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db, logout } from "../utils/firebase";
import UserData from "./UserData";

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
      console.log(id, uid)
      if (id == uid) {
        setIsMyPage(true);
        setUserId(id);
      } else {
        setUserId(uid);
      }
      console.log(userId)
    });
  }, [user, loading]);
  return (
    <div>
      <NavBar />
      <UserData myPage={isMyPage} uid={userId} />
    </div>
  );
}
