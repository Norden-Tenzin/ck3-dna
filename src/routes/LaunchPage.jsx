import React, { useEffect, useState } from "react";
import CardPage from "../components/CardPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { GiFemale, GiMale } from "react-icons/gi";
import {
  query,
  collection,
  where,
  and,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
// style
import "../style/LaunchPage.scss";
// internal
import { auth, db, logout } from "../utils/firebase";
import { Dropdown } from "../components/Dropdown";
import NavBar from "../components/NavBar";
import { limit_number } from "../utils/helper";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  // States
  const [userId, setUserId] = useState("");
  const [isMyPage, setIsMyPage] = useState(false);
  const [childHeight, setChildHeight] = useState(0);
  const [myQuery, setMyQuery] = useState(null);
  const [myWhere, setMyWhere] = useState([]);

  // Checkboxes
  // SEX
  const [sexMale, setSexMale] = useState(false);
  const [sexFemale, setSexFemale] = useState(false);
  // MODS
  const [modEPE, setModEPE] = useState(false);
  const [modCFP, setModCFP] = useState(false);
  const [modVanilla, setModVanilla] = useState(false);

  const flipModEPE = () => {
    if (modEPE) {
      setModEPE(false);
    } else {
      setModEPE(true);
      setModVanilla(false);
    }
  };

  const flipModCFP = () => {
    if (modCFP) {
      setModCFP(false);
    } else {
      setModCFP(true);
      setModVanilla(false);
    }
  };

  const flipModVanilla = () => {
    if (modVanilla) {
      setModVanilla(false);
    } else {
      setModVanilla(true);
      setModCFP(false);
      setModEPE(false);
    }
  };

  const flipSexMale = () => {
    if (sexMale) {
      setSexMale(false);
    } else {
      setSexMale(true);
      setSexFemale(false);
    }
  };

  const flipSexFemale = () => {
    if (sexFemale) {
      setSexFemale(false);
    } else {
      setSexFemale(true);
      setSexMale(false);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    console.log(
      "%cCardPage.jsx line:39 scrollTop",
      "color: #007acc;",
      scrollTop
    );
    console.log(
      "%cCardPage.jsx line:40 scrollHeight",
      "color: #007acc;",
      scrollHeight
    );
    console.log(
      "%cCardPage.jsx line:41 clientHeight",
      "color: #007acc;",
      clientHeight
    );
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("SCROLLED TO BOTTOM");
    }
    // if (!areMore) {
    //   window.removeEventListener("scroll", handleScroll);
    // }
  };

  const search = () => {
    // TODO set filters and refresh page
    let queryLst = [];
    if (sexMale === true) {
      queryLst.push(where("sex", "==", "male"));
    } else if (sexFemale === true) {
      queryLst.push(where("sex", "==", "female"));
    } else {
    }

    let modLst = [];
    if (modEPE === true) {
      modLst.push("epe");
    }
    if (modCFP === true) {
      modLst.push("cfp");
    }
    if (modVanilla === true) {
      modLst.push("vanilla");
    }
    if (modLst.length > 0) {
      queryLst.push(where("modList", "in", [modLst]));
    }

    setMyWhere(queryLst);
  };

  useEffect(() => {
    if (loading) return;
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="page_container">
      <div className="page">
        <NavBar />
        <div className="page_grid_container">
          <div className="page_grid">
            <div className="page_data">
              <p className="page_name">Filters</p>
              <Dropdown
                title={"Mods"}
                className="dd-wrapper-filter"
                showArrow={true}
              >
                <div className="dd-list">
                  <DropdownItem>
                    {
                      <div
                        className="dd-list-item-container"
                        onClick={flipModEPE}
                      >
                        <div className="dd-list-item-text">EPE</div>
                        <label className="dd-list-item-checkbox">
                          <input
                            type="checkbox"
                            checked={modEPE}
                            onChange={flipModEPE}
                          />
                        </label>
                      </div>
                    }
                  </DropdownItem>
                  <div className="divider"></div>
                  <DropdownItem>
                    {
                      <div
                        className="dd-list-item-container"
                        onClick={flipModCFP}
                      >
                        <div className="dd-list-item-text">CFP </div>
                        <label className="dd-list-item-checkbox">
                          <input
                            type="checkbox"
                            checked={modCFP}
                            onChange={flipModCFP}
                          />
                        </label>
                      </div>
                    }
                  </DropdownItem>
                  <div className="divider"></div>
                  <DropdownItem>
                    {
                      <div
                        className="dd-list-item-container"
                        onClick={flipModVanilla}
                      >
                        <div className="dd-list-item-text">Vanilla </div>
                        <label className="dd-list-item-checkbox">
                          <input
                            type="checkbox"
                            checked={modVanilla}
                            onChange={flipModVanilla}
                          />
                        </label>
                      </div>
                    }
                  </DropdownItem>
                </div>
              </Dropdown>
              <Dropdown
                title={"Sex"}
                className="dd-wrapper-filter"
                showArrow={true}
              >
                <div className="dd-list">
                  <DropdownItem>
                    {
                      <div
                        className="dd-list-item-container"
                        onClick={flipSexMale}
                      >
                        <div className="dd-list-item-text">Male</div>
                        <GiMale className="dd-list-item-icon" size={20} />
                        <label className="dd-list-item-checkbox">
                          <input
                            type="checkbox"
                            checked={sexMale}
                            onChange={flipSexMale}
                          />
                        </label>
                      </div>
                    }
                  </DropdownItem>
                  <div className="divider"></div>
                  <DropdownItem>
                    {
                      <div
                        className="dd-list-item-container"
                        onClick={flipSexFemale}
                      >
                        <div className="dd-list-item-text">Female</div>
                        <GiFemale className="dd-list-item-icon" size={20} />
                        <label className="dd-list-item-checkbox">
                          <input
                            type="checkbox"
                            checked={sexFemale}
                            onChange={flipSexFemale}
                          />
                        </label>
                      </div>
                    }
                  </DropdownItem>
                </div>
              </Dropdown>
              <button className="filter_button" onClick={search}>
                search
              </button>
            </div>
            <div className="page_cards">
              <CardPage
                className="card-page"
                fieldName="modList"
                condition="array-contains-any"
                expression={["epe", "cfp"]}
                myQuery={myQuery}
                myWhere={myWhere}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function DropdownItem(props) {
    return <div onClick={props.onClick}>{props.children}</div>;
  }
}
