import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CharacterPage(props) {
  const location = useLocation();
  let url = location.state.url;
  console.log(url)
  return (
    <div>
      <img src={location.state.url} className="card-image" />
    </div>
  );
}
