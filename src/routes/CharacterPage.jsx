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
import "../style/CharaPage.scss";
// internal
import Tag from "./Tag";
import { dna } from "../utils/helper";
import { auth, db, logout, storage } from "../utils/firebase";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";

export default function CharacterPage(props) {
  const [user, loading, error] = useAuthState(auth);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loaded, setIsLoaded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [copiedTimer, setCopiedTimer] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useParams();
  const charaId = params.charaId;

  useEffect(() => {
    console.log(thumbsSwiper);
    getData();
  }, [thumbsSwiper]);

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

  const buttonTimer = async () => {
    await navigator.clipboard.writeText(data["dna"]);
    var ticks = 1; // set initial ticks
    setCopiedTimer(ticks);
    var interval = setInterval(function () {
      ticks--; // decrement ticks
      if (ticks < 0) {
        clearInterval(interval); // stop the interval when ticks reach 0
      } else {
        setCopiedTimer(ticks);
      }
    }, 1000); // set interval to 1000 milliseconds (1 second)
  };

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        {isOpen && <Modal setIsOpen={setIsOpen} data={data}/>}
        <div className="page_items">
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
            className="swiper"
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
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs]}
            className="swiper-thumb"
          >
            {data["displayImage"] ? (
              <SwiperSlide>
                <img
                  src={data["displayImage"]}
                  className="swiper-thumb-image"
                />
              </SwiperSlide>
            ) : (
              <SwiperSlide />
            )}
            {data["gridImages"] && data["gridImages"].length > 0
              ? data["gridImages"].map((url, index) => (
                  <SwiperSlide key={index}>
                    <img src={url} className="swiper-thumb-image" />
                  </SwiperSlide>
                ))
              : ""}
          </Swiper>
          <div className="chara_data">
            <p className="chara_name">{data["name"]}</p>
            <div className="tag-holder">
              {data["modList"]
                ? data["modList"].map((mod, index) => (
                    <Tag value={mod} key={index} />
                  ))
                : ""}
            </div>
            <p className="chara_desc">{data["description"]}</p>
            <p className="chara_auth">by John Doe</p>
            <p className="chara_date">29/02/2023</p>
            <div className="button_container">
              <button className="button fill" onClick={buttonTimer}>
                {copiedTimer > 0 ? "Copied" : "Copy DNA"}
              </button>
              <button
                className="button border"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                View DNA
              </button>
            </div>
          </div>

          {/* <div className="data-container">
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
        </div> */}
        </div>
      </div>
    </div>
  );
}
