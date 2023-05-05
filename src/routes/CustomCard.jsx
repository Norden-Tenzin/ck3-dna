import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { FaCopy, FaHeart } from "react-icons/fa";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";

export default function CustomCard(props) {  
  const navigate = useNavigate();
  console.log(props.data)
  return (
    <div
      onClick={() => {
        navigate(`/chara/${props.data.pid}`);
      }}
      className="card"
    >
      <img src={props.data["displayImage"]} className="card-image" />
      <MdOutlineFavoriteBorder className="card-icon" />
    </div>
  );
}
