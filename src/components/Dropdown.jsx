import React, { useState } from "react";
// style
import "../style/Dropdown.scss";

function Dropdown(props) {
  const [isDropOpen, setIsDropOpen] = useState(false);

  const toggleList = () => {
    setIsDropOpen(!isDropOpen);
  };

  return (
    <div className="dd-wrapper">
      <div className="dd-button" onClick={toggleList}>
        <div className="dd-button-text">{props.title}</div>
      </div>
      {isDropOpen && props.children}
    </div>
  );
}


export { Dropdown };
