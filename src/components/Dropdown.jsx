import React, { useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
// style
import "../style/Dropdown.scss";

function Dropdown(props) {
  const [isDropOpen, setIsDropOpen] = useState(false);

  const toggleList = () => {
    setIsDropOpen(!isDropOpen);
  };

  const renderArrow = () => {
    if (isDropOpen) {
      return <SlArrowUp className="dd-button-icon"/>;
    } else {
      return <SlArrowDown className="dd-button-icon"/>;
    }
  };

  return (
    <div className={props.className || "dd-wrapper"}>
      <div className="dd-button" onClick={toggleList}>
        <div className="dd-button-text">{props.title}</div>
        {props.showArrow && renderArrow()}
      </div>
      {props.showArrow && !isDropOpen && props.children}
      {!props.showArrow && isDropOpen && props.children}
    </div>
  );
}

export { Dropdown };
