// import React, { useState } from "react";
// import { SlArrowUp, SlArrowDown } from "react-icons/sl";
// // style
// import "../style/Dropdown.scss";

// function Dropdown(props) {
//   const [isDropOpen, setIsDropOpen] = useState(false);

//   const toggleList = () => {
//     setIsDropOpen(!isDropOpen);
//   };

//   const renderArrow = () => {
//     if (isDropOpen) {
//       return <SlArrowUp className="dd-button-icon"/>;
//     } else {
//       return <SlArrowDown className="dd-button-icon"/>;
//     }
//   };the

//   return (
//     <div className={props.className || "dd-wrapper"}>
//       <div className="dd-button" onClick={toggleList}>
//         <div className="dd-button-text">{props.title}</div>
//         {props.showArrow && renderArrow()}
//       </div>
//       {props.showArrow && !isDropOpen && props.children}
//       {!props.showArrow && isDropOpen && props.children}
//     </div>
//   );
// }
// function DropdownItem(props) {
//   return <div onClick={props.onClick}>{props.children}</div>;
// }

// export { Dropdown, DropdownItem};

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
// style
import "../style/Dropdown.scss";

const Dropdown = forwardRef((props, ref) => {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleList = () => {
    setIsDropOpen(!isDropOpen);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleList: toggleList,
    };
  });

  const renderArrow = () => {
    if (isDropOpen) {
      return <SlArrowUp className="dd-button-icon" />;
    } else {
      return <SlArrowDown className="dd-button-icon" />;
    }
  };

  useEffect(() => {
    if (!props.showArrow) {
      const handleOutsideClick = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropOpen(false);
        }
      };

      if (isDropOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
      }

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isDropOpen]);

  return (
    <div className={props.className || "dd-wrapper"} ref={dropdownRef}>
      <div className="dd-button" onClick={toggleList}>
        <div className="dd-button-text">{props.title}</div>
        {props.showArrow && renderArrow()}
      </div>
      {props.showArrow && isDropOpen && props.children}
      {!props.showArrow && isDropOpen && props.children}
    </div>
  );
});
const DropdownItem = (props) => {
  return <div onClick={props.onClick}>{props.children}</div>;
};

export { Dropdown, DropdownItem };
