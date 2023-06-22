import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Swiper as SwiperJSX, SwiperSlide } from "swiper/react";
import { Swiper, Navigation, Pagination, Thumbs } from "swiper";
import { useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import { GiFemale, GiMale } from "react-icons/gi";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  limit,
  DocumentData,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
// style
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../style/CharaPage.scss";
// internal
import Tags from "../components/Tags";
import { auth, db, logout, storage } from "../utils/firebase";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";

export default function CharacterPage(props) {
  // const [user, loading, error] = useAuthState(auth);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [loaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [copiedTimer, setCopiedTimer] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const charaId = params.charaId;

  useEffect(() => {
    getData().then((data) => {
      getAuthorName(data);
    });
  }, []);

  const getData = async () => {
    try {
      let res = [];
      const ref = collection(db, "posts");
      let q = query(
        ref,
        where("pid", "==", charaId),
        orderBy("date", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      setData(doc.data());
      setIsLoaded(true);
      return doc.data();
    } catch (error) {
      console.log(
        "%cerror CharacterPage.jsx line:31 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  const getAuthorName = async (data) => {
    try {
      let res = [];
      const ref = collection(db, "users");
      let q = query(ref, where("uid", "==", data["authorId"]), limit(1));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      setAuthorName(`@${doc.data()["name"]}`);
    } catch (error) {
      console.log(
        "%cerror CharacterPage.jsx line:31 ",
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

  function getGridImages(className) {
    console.log(data["gridImages"]);
    if (data["gridImages"] && data["gridImages"].length > 0) {
      return data["gridImages"].map((url, index) => (
        <SwiperSlide key={index}>
          <img src={url} className={className} />
        </SwiperSlide>
      ));
    } else {
      return "";
      // let lst = [];
      // for (let i = 0; i < 3; i++) {
      //   lst.push(
      //     // <SwiperSlide key={i}>
      //     //   <img src={data["displayImage"]} className={className} />
      //     // </SwiperSlide>
      //     <SwiperSlide>
      //     <div className="skeleton_thumb_img" />
      //   </SwiperSlide>
      //   );
      // }
      // return lst;
    }
  }

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        {isOpen && <Modal setIsOpen={setIsOpen} data={data} type="textView" />}
        <div className="page_items">
          <SwiperJSX
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
            className="my-swiper"
          >
            {data.length != 0 ? (
              <SwiperSlide>
                <img src={data["displayImage"]} className="my-swiper-image" />
              </SwiperSlide>
            ) : (
              <SwiperSlide>
                <div className="skeleton_img" />
              </SwiperSlide>
            )}
            {/* GRID IMAGES */}
            {getGridImages("my-swiper-image")}
          </SwiperJSX>
          <SwiperJSX
            // @ts-ignore
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs]}
            className="my-swiper-thumb"
          >
            {data.length != 0 ? (
              <SwiperSlide>
                <img
                  src={data["displayImage"]}
                  className="my-swiper-thumb-image"
                />
              </SwiperSlide>
            ) : (
              <SwiperSlide>
                <div className="skeleton_thumb_img" />
              </SwiperSlide>
            )}
            {/* THUMB GRID IMAGES */}
            {getGridImages("my-swiper-thumb-image")}
          </SwiperJSX>
          <div className="chara_data">
            {data.length != 0 ? (
              <div className="chara_name_container">
                <p className="chara_name">{data["name"]}</p>
                {data["sex"] == "male" ? (
                  <GiMale size={30} />
                ) : (
                  <GiFemale size={30} />
                )}
              </div>
            ) : (
              <div className="skeleton_title"></div>
            )}

            {data.length != 0 ? (
              <Tags mods={data["modList"]} />
            ) : (
              <Tags
                className="tag_holder"
                mods={["", ""]}
                tagClassName={"skeleton_tag"}
              />
            )}

            {data.length != 0 ? (
              <p className="chara_desc">{data["description"]}</p>
            ) : (
              // <p className="chara_desc">
              //   Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              //   quis tenetur quisquam, molestiae minus numquam molestias eos
              //   temporibus perferendis ipsum sunt laborum obcaecati eveniet
              //   culpa voluptatem delectus dolorum nulla veniam.
              // </p>
              <div className="skeleton_body">
                <div className="skeleton_text"></div>
                <div className="skeleton_text"></div>
                <div className="skeleton_text"></div>
              </div>
            )}

            {authorName != "" ? (
              <a
                onClick={() => {
                  navigate(`/ck3-dna/user/${data["authorId"]}`);
                }}
                className="chara_auth"
              >
                {authorName}
              </a>
            ) : (
              <div className="skeleton_text"></div>
            )}

            {data.length != 0 ? (
              <p className="chara_date">29/02/2023</p>
            ) : (
              <div className="skeleton_text"></div>
            )}

            {data.length != 0 ? (
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
            ) : (
              <div className="skeleton_button_container">
                <div className="skeleton_button"></div>
                <div className="skeleton_button"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
