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
import { db } from "../utils/firebase";
import CustomCard from "./CustomCard";
import { limit_number } from "../utils/helper";

export default function CardPage(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [cardData, setCardData] = React.useState([]);
  const [lastVisible, setLastVisible] = React.useState("");
  const [areMore, setAreMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useEffect(() => {
    getData();
  }, [props.myWhere]);

  const getData = async () => {
    setIsLoading(true);
    let res = [];
    try {
      let q;
      const ref = collection(db, "posts");
      q = query(
        ref,
        ...props.myWhere,
        orderBy("date", "desc"),
        limit(limit_number)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // res.push(doc.data());
        res.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setAreMore(querySnapshot.docs.length < limit_number ? false : true);
      if (querySnapshot.docs.length >= limit_number === true) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }
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

  const loadMoreData = async () => {
    setIsLoading(true);
    let res = cardData;
    try {
      let q;
      const ref = collection(db, "posts");
      q = query(
        ref,
        ...props.myWhere,
        orderBy("date", "desc"),
        startAfter(lastVisible),
        limit(limit_number)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // res.push(doc.data());
        res.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setAreMore(querySnapshot.docs.length < limit_number ? false : true);
      if (querySnapshot.docs.length >= limit_number === true) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }
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
    <div className="image_item" key={key}>
      <img src={url} />
    </div>
  );

  const deleteCard = (id) => {
    let res = cardData.filter((card) => card.id !== id);
    setCardData(res);
  };

  return (
    <div className="card_page">
      <div className="scroll">
        <div>
          <div className="card_grid">
            {loaded
              ? cardData.map((card, index) => (
                  <CustomCard
                    key={index}
                    id={card.id}
                    data={card.data}
                    dropdown={props.dropdown}
                    dropdownType={props.dropdownType}
                    deleteCard={deleteCard}
                  />
                ))
              : [...Array(limit_number)].map((_, index) => (
                  <CustomCard key={index} isSkeleton={true} />
                ))}
          </div>
          {areMore && cardData.length !== 0 && (
            <button
              className="end"
              onClick={() => {
                loadMoreData();
              }}
            >
              Show More
            </button>
          )}
          {!areMore && <p className="end">END</p>}
        </div>
      </div>
    </div>
  );
}
