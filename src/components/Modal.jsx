import React from "react";
import ReactMarkdown from "react-markdown";
import { RiCloseLine } from "react-icons/ri";
// Style
import "../style/Modal.scss";

const Modal = ({ setIsOpen, data, type, deleteFunc }) => {
  return (
    <div>
      <div className="modal_background" onClick={() => setIsOpen(false)} />
      <div className="centered">
        {type === "alert" && (
          <div className="modal_alert">
            <div className="modalHeader">
              <h5 className="heading">Delete</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className="modalContent">
              Are you sure you want to delete this item?
            </div>
            <div className="modalButtonHolder">
              <button
                className="cancel_button"
                onClick={() => setIsOpen(false)}
              >
                cancel
              </button>
              <button
                className="delete_button"
                onClick={() => {
                  setIsOpen(false);
                  deleteFunc();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        {type === "textView" && (
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">DNA</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>
            <div className="modalContent">iodwjahdoi</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
