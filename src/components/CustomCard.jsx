import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaHeart } from "react-icons/fa";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import Tags from "../components/Tags";

export default function CustomCard(props) {
  const { data, mods, isSkeleton } = props;
  const navigate = useNavigate();
  return (
    <div>
      {data && isSkeleton != false ? (
        <div
          onClick={() => {
            navigate(`/chara/${props.data.pid}`);
          }}
          className="card"
        >
          <img src={props.data["displayImage"]} className="card_image" />
          {/* <MdOutlineFavoriteBorder className="card-icon" /> */}
          <Tags className="tag_holder card_icon" mods={props.data["modList"]} />
        </div>
      ) : (
        <div className="card">
          <div className="skeleton_card_img" />
          <Tags
            className="tag_holder card_icon"
            mods={["", ""]}
            tagClassName={"skeleton_tag"}
          />
        </div>
      )}
    </div>
  );
}
