import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import axios from "axios";
// style
import "../style/CardPage.scss";
// internal
import CustomCard from "./CustomCard";
import { db } from "../utils/firebase";

export default function CardPage(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [cardData, setCardData] = React.useState([]);
  const [lastVisible, setLastVisible] = React.useState("");
  const [areMore, setAreMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const limit_number = 9;
    // console.log(props.fieldName, props.condition, props.query);
    let res = cardData;
    try {
      let q;
      const ref = collection(db, "posts");
      if (lastVisible === "") {
        console.log("firstTime", "color: #007acc;");
        q = query(
          ref,
          where(props.fieldName, props.condition, props.query),
          orderBy("date", "desc"),
          limit(limit_number)
        );
      } else {
        console.log("nextTime", "color: #007acc;");
        console.log(
          "%cCardPage.jsx line:43 lastVisible",
          "color: #007acc;",
          lastVisible
        );
        q = query(
          ref,
          where(props.fieldName, props.condition, props.query),
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(5)
        );
      }
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setAreMore(querySnapshot.docs.length < limit_number ? false : true);
      console.log("%cCardPage.jsx line:85 areMore", "color: #007acc;", areMore);
      if (areMore)
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setCardData(res);
      setLoaded(true);
    } catch (error) {
      console.log(
        "%cerror CardPage.jsx line:31 ",
        "color: red; display: block; width: 100%;",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const UnsplashImage = ({ url, key }) => (
    <div className="image-item" key={key}>
      <img src={url} />
    </div>
  );

  return (
    <div className="card-page">
      <div className="scroll">
        <div>
          <div className="card-grid">
            {loaded
              ? cardData.map((data, index) => (
                  <CustomCard data={data} key={index} />
                ))
              : ""}
          </div>
          {cardData.length === 0 && <p>{"Loading..."}</p>}
          {areMore && cardData.length !== 0 && (
            <button
              className="end"
              onClick={() => {
                getData();
              }}
            >
              Load More
            </button>
          )}
          {!areMore && <p className="end">END</p>}
        </div>
      </div>
    </div>
  );
}
