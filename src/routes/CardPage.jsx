import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import axios from "axios";
// style
import "../style/CardPage.scss";
// internal
import CustomCard from "./CustomCard";
import { db } from "../utils/firebase";

export default function CardPage(props) {
  console.log("HERE");
  const [loaded, setIsLoaded] = React.useState(false);
  const [cardData, setCardData] = React.useState([]);

  const getData = async () => {
    console.log(props.fieldName, props.condition, props.query);
    let res = [];
    try {
      const ref = collection(db, "posts");
      let q = query(
        ref,
        where(props.fieldName, props.condition, props.query),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(doc);
        res.push(doc.data());
      });
      setCardData(res);
      setIsLoaded(true);
    } catch (error) {
      console.log(
        "%cerror CardPage.jsx line:31 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  React.useEffect(() => {
    getData();
    // fetchImages();
  }, []);

  // const fetchImages = (count = 10) => {
  //   const apiRoot = "https://api.unsplash.com";
  //   const accessKey = "DnDfcNJcANiOOmGQsJb7SuRH-UHtEkbeP1eTmIrm4-I";
  //   axios
  //     .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
  //     .then((res) => {
  //       setImages([...images, ...res.data]);
  //       setIsLoaded(true);
  //     });
  // };

  const UnsplashImage = ({ url, key }) => (
    <div className="image-item" key={key}>
      <img src={url} />
    </div>
  );

  return (
    <div className="card-page">
      <InfiniteScroll
        dataLength={cardData}
        // next={() => fetchImages(5)}
        hasMore={true}
        loader={
          <img
            src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
            alt="loading"
          />
        }
      >
        <div className="card-grid">
          {loaded
            ? cardData.map((data, index) => (
                <CustomCard data={data} key={index} />
              ))
            : ""}
        </div>
      </InfiniteScroll>
    </div>
  );
}
