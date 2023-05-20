import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaHeart } from "react-icons/fa";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import Tags from "../components/Tags"

export default function CustomCard(props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/chara/${props.data.pid}`);
      }}
      className="card"
    >
      <img src={props.data["displayImage"]} className="card-image" />
      {/* <MdOutlineFavoriteBorder className="card-icon" /> */}
      <Tags className="tag_holder card_icon" mods={props.data["modList"]}/>
    </div>
  );
}
