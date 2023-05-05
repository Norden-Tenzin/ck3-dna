import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper";
import { FaCopy } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";

// style
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// internal
import Tag from "./Tag";
import { dna } from "../utils/helper";
import { auth, db, logout, storage } from "../utils/firebase";
import NavBar from "./NavBar";

export default function CharacterPage(props) {
  const [user, loading, error] = useAuthState(auth);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const params = useParams();
  const charaId = params.charaId;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = [];
    try {
      const ref = collection(db, "posts");
      let q = query(
        ref,
        where("pid", "==", charaId),
        orderBy("date", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      // console.log("RES:")
      // console.log(typeof res);
      console.log(res[0]["gridImages"]);
      setData(res[0]);
      setIsLoaded(true);
    } catch (error) {
      console.log(
        "%cerror CardPage.jsx line:31 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  return (
    <div className="chara-page">
      <NavBar />
      <Swiper
        loop={true}
        centeredSlides={true}
        navigation={true}
        pagination={{
          dynamicBullets: true,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Pagination, Thumbs]}
        spaceBetween={50}
        slidesPerView={1}
        // onSlideChange={() => console.log("slide change")}
        // onSwiper={(swiper) => console.log(swiper)}
        className="swiper-container"
      >
        {data["displayImage"] ? (
          <SwiperSlide>
            <img src={data["displayImage"]} className="swiper-image" />
          </SwiperSlide>
        ) : (
          <SwiperSlide />
        )}
        {data["gridImages"] && data["gridImages"].length > 0
          ? data["gridImages"].map((url, index) => (
              <SwiperSlide key={index}>
                <img src={url} className="swiper-image" />
              </SwiperSlide>
            ))
          : ""}
      </Swiper>
      <div className="data-container">
        <div className="data-name">{data["name"]}</div>
        <div className="title-tag-container">
          <p className="data-title">mods used:</p>
          <div className="tag-holder">
            {data["modList"]
              ? data["modList"].map((mod, index) => (
                  <Tag value={mod} key={index} />
                ))
              : ""}
          </div>
        </div>
        <div className="title-tag-container">
          <p className="data-title">tag:</p>
          <div className="tag-holder">
            {data["modList"]
              ? data["modList"].map((mod, index) => (
                  <Tag value={mod} key={index} />
                ))
              : ""}
          </div>
        </div>
        <div className="description">
          <div className="description-title">Description:</div>
          <div className="description-body">{data["description"]}</div>
        </div>

        <div className="data-dna">
          <ReactMarkdown children={"```" + data["dna"] + "```"} />
          <FaCopy className="dna-icon" />
        </div>
      </div>
    </div>
  );
}
