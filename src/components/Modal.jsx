import React from "react";
import ReactMarkdown from "react-markdown";
import { RiCloseLine } from "react-icons/ri";
// Style
import "../style/Modal.scss";

const Modal = ({ setIsOpen, data }) => {
  return (
    <div>
      <div className="modal_background" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">DNA</h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className="modalContent">
            <ReactMarkdown children={"```" + data["dna"] + "```"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
