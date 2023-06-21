import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaHeart } from "react-icons/fa";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { GiFemale, GiMale } from "react-icons/gi";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { BsThreeDots } from "react-icons/bs";
import { doc, deleteDoc } from "firebase/firestore";

// internal
import { db } from "../utils/firebase";
import Tags from "../components/Tags";
import { Dropdown, DropdownItem } from "./Dropdown";
import Modal from "../components/Modal";

export default function CustomCard(props) {
  const { data, mods, isSkeleton, id } = props;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [copiedTimer, setCopiedTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(()=>{
  //   console.log(`user: ${props.at}`)
  //   console.log(props.at.uid)

  //   console.log(props.data.authorId)
  // }, [])

  const deleteCard = async () => {
    try {
      const docRef = doc(db, "posts", id);
      await deleteDoc(docRef);
      props.deleteCard(id);
    } catch (error) {
      console.log(
        "%cerror CustomCard.jsx line:24 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `http://localhost:3000/chara/${props.data.pid}`
    );
    var ticks = 1; // set initial ticks
    setCopiedTimer(ticks);
    var interval = setInterval(function () {
      ticks--; // decrement ticks
      if (ticks < 0) {
        clearInterval(interval); // stop the interval when ticks reach 0
      } else {
        setCopiedTimer(ticks);
      }
    }, 1000); // set interval to 1000 milliseconds (1 second)
  };

  return (
    <div>
      {isModalOpen && (
        <Modal
          setIsOpen={setIsModalOpen}
          data={data}
          type="alert"
          deleteFunc={deleteCard}
        />
      )}
      {data && isSkeleton != false ? (
        <div className="card">
          <img
            src={props.data["displayImage"]}
            className="card_image"
            onClick={() => {
              navigate(`/ck3-dna/chara/${props.data.pid}`);
            }}
          />
          <Tags className="tag_holder card_icon" mods={props.data["modList"]} />
          {props.dropdown && (
            <Dropdown
              title={<BsThreeDots />}
              className="dd-wrapper-card"
              ref={dropdownRef}
            >
              <div className="dd-list">
                {props.dropdownType === "user" &&
                  props.at.uid === props.data.authorId && (
                    <DropdownItem>
                      {
                        <div
                          className="dd-list-item-container"
                          onClick={() => {
                            setIsModalOpen(true);
                            dropdownRef.current.toggleList();
                          }}
                        >
                          <div className="dd-list-item-text delete">delete</div>
                        </div>
                      }
                    </DropdownItem>
                  )}
                {props.dropdownType === "user" &&
                  props.at.uid === props.data.authorId && (
                    <div className="divider"></div>
                  )}
                <DropdownItem>
                  {
                    <div className="dd-list-item-container" onClick={copyLink}>
                      <div className="dd-list-item-text">
                        {copiedTimer > 0 ? "copied" : "copy link"}
                      </div>
                    </div>
                  }
                </DropdownItem>
                <DropdownItem>
                  {
                    <div
                      className="dd-list-item-container"
                      onClick={() => {
                        dropdownRef.current.toggleList();
                      }}
                    >
                      <div className="dd-list-item-text">cancel</div>
                    </div>
                  }
                </DropdownItem>
              </div>
            </Dropdown>
          )}
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
