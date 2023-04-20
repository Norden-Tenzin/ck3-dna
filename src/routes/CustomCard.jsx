import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { FaCopy } from "react-icons/fa";

export default function CustomCard(props) {  
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate("/chara", {
          state: {url: props.url},
        });
      }}
      className="card"
    >
      <img src={props.url} className="card-image" />
      <FaCopy className="card-copy-icon" />
    </div>
  );
}
