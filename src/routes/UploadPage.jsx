import React, { useState, useRef, useEffect } from "react";
import { FaFileUpload, FaPlus } from "react-icons/fa";
import { TfiPlus } from "react-icons/tfi";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as uuid from "uuid";
// style
import "../style/UploadPage.scss";
// internal
import { auth, db, logout, storage } from "../utils/firebase";
import NavBar from "../components/NavBar";

export default function UploadPage() {
  const navigate = useNavigate();
  const [postId, setPostId] = useState(uuid.v4());
  const [isLoading, setIsLoading] = useState(false);
  const [reqFail, setReqFail] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  // STRING PARAMETERS
  const [charaName, setCharaName] = useState("");
  const [description, setDescription] = useState("");
  const [dna, setDna] = useState("");
  // CHECKBOX
  const [isCheckedMod1, setIsCheckedMod1] = useState(false);
  const [isCheckedMod2, setIsCheckedMod2] = useState(false);
  const [isCheckedVanilla, setIsCheckedVanilla] = useState(false);
  const [isCheckedMale, setIsCheckedMale] = useState(false);
  const [isCheckedFemale, setIsCheckedFemale] = useState(false);
  // DISPLAY IMAGE
  const [displayImage, setDisplayImage] = useState(null);
  const hiddenDisplayImageInput = useRef(null);
  // GRID IMAGE
  const [gridImage1, setGridImage1] = useState(null);
  const hiddenGridImageInput1 = useRef(null);
  const [gridImage2, setGridImage2] = useState(null);
  const hiddenGridImageInput2 = useRef(null);
  const [gridImage3, setGridImage3] = useState(null);
  const hiddenGridImageInput3 = useRef(null);
  // URLS
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/ck3-dna/");
    if (imageUrls.length > 0) {
      uploadData(imageUrls);
      setImageUrls([]);
    }
  }, [user, loading, imageUrls]);

  const getModList = () => {
    const res = [];
    if (isCheckedMod1) res.push("epe");
    if (isCheckedMod2) res.push("cfp");
    if (isCheckedVanilla) res.push("vanilla");
    return res;
  };

  const getSex = () => {
    if (isCheckedMale) return "male";
    if (isCheckedFemale) return "female";
    return "";
  };

  // NOTE: Checkbox handlers
  const handleChangeMod1 = () => {
    if (isCheckedVanilla == true && isCheckedMod1 == false) {
      setIsCheckedVanilla(false);
      setIsCheckedMod1(true);
    } else {
      setIsCheckedMod1(!isCheckedMod1);
    }
  };
  const handleChangeMod2 = () => {
    if (isCheckedVanilla == true && isCheckedMod1 == false) {
      setIsCheckedVanilla(false);
      setIsCheckedMod2(true);
    } else {
      setIsCheckedMod2(!isCheckedMod2);
    }
  };
  const handleChangeVanilla = () => {
    if (
      isCheckedVanilla == false &&
      (isCheckedMod1 == true || isCheckedMod2 == true)
    ) {
      setIsCheckedVanilla(true);
      setIsCheckedMod1(false);
      setIsCheckedMod2(false);
    } else {
      setIsCheckedVanilla(!isCheckedVanilla);
    }
  };
  const handleChangeMale = () => {
    if (isCheckedFemale) {
      setIsCheckedFemale(false);
      setIsCheckedMale(true);
    } else {
      setIsCheckedMale(!isCheckedMale);
    }
  };
  const handleChangeFemale = () => {
    if (isCheckedMale) {
      setIsCheckedMale(false);
      setIsCheckedFemale(true);
    } else {
      setIsCheckedFemale(!isCheckedFemale);
    }
  };

  // NOTE: Image Handlers
  // Display Image
  const handleChangeDisplayImage = (e) => {
    setDisplayImage(e.target.files[0]);
  };
  const handleDisplayClick = (e) => {
    hiddenDisplayImageInput.current.click();
  };

  // Grid Image
  const handleChangeGridImage1 = (e) => {
    setGridImage1(e.target.files[0]);
  };
  const handleGridClick1 = (e) => {
    hiddenGridImageInput1.current.click();
  };
  const handleChangeGridImage2 = (e) => {
    setGridImage2(e.target.files[0]);
  };
  const handleGridClick2 = (e) => {
    hiddenGridImageInput2.current.click();
  };
  const handleChangeGridImage3 = (e) => {
    setGridImage3(e.target.files[0]);
  };
  const handleGridClick3 = (e) => {
    hiddenGridImageInput3.current.click();
  };

  const isFormValid = () => {
    return (
      displayImage !== null &&
      charaName !== "" &&
      getSex() !== "" &&
      getModList() !== [] &&
      dna !== ""
    );
  };

  // NOTE: Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const path = `${user.uid}/${postId}/`;
    setIsLoading(true);
    if (!isFormValid()) {
      setReqFail(true);
      setIsLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const getType = (name) => {
      const type = name.split(".")[1].toLowerCase();
      const types = {
        jpg: "jpeg",
        jpeg: "jpeg",
        png: "png",
      };
      return types[type] || "jpeg";
    };

    // NOTE: Image Resize
    const resizeImage = async (imageFile) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        return compressedFile;
      } catch (error) {
        console.log(
          "%cerror UploadPage.jsx line:219 ",
          "color: red; display: block; width: 100%;",
          error
        );
      }
    };

    // NOTE: Image Upload
    const uploadImage = async (imageName, image) => {
      return new Promise(async (resolve, reject) => {
        const resizedImage = await resizeImage(image);
        const StorageRef = ref(
          storage,
          path + imageName + "." + getType(image.name)
        );
        try {
          const snapshot = await uploadBytesResumable(StorageRef, resizedImage);
          const downloadURL = await getDownloadURL(snapshot.ref);
          // console.log("Image uploaded successfully:", downloadURL);
          resolve(downloadURL);
        } catch (error) {
          console.log(
            "%cerror UploadPage.jsx line:252 ",
            "color: red; display: block; width: 100%;",
            error
          );
          reject(error);
        }
      });
    };

    const uploadImages = async () => {
      let imgLst = [];
      if (displayImage !== null) {
        imgLst.push({
          "image-name": "display-image",
          "image-file": displayImage,
        });
      }
      if (gridImage1 !== null) {
        imgLst.push({
          "image-name": "grid-image-1",
          "image-file": gridImage1,
        });
      }
      if (gridImage2 !== null) {
        imgLst.push({
          "image-name": "grid-image-2",
          "image-file": gridImage2,
        });
      }
      if (gridImage3 !== null) {
        imgLst.push({
          "image-name": "grid-image-3",
          "image-file": gridImage3,
        });
      }

      const imagePromises = imgLst.map((img) => {
        return uploadImage(img["image-name"], img["image-file"]);
      });

      try {
        const urls = await Promise.all(imagePromises);
        // console.log("All URLs updated:", urls);
        setImageUrls(urls);
      } catch (error) {
        console.log(
          "%cerror UploadPage.jsx line:322 ",
          "color: red; display: block; width: 100%;",
          error
        );
      }
    };

    uploadImages().then(() => {
      // console.log("Submit Done");
      setIsLoading(false);
      setPostId(uuid.v4());
    });
  };

  const uploadData = async (urls) => {
    try {
      addDoc(collection(db, "posts"), {
        authorId: user.uid,
        pid: postId,
        name: charaName,
        sex: getSex(),
        description: description,
        displayImage: urls.shift(),
        gridImages: urls,
        modList: getModList(),
        tagList: [],
        dna: dna,
        date: new Date(Date.now()),
      });
    } catch (error) {
      console.log(
        "%cerror UploadPage.jsx line:246 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }
  };

  return (
    <div className="upload_page_container">
      <div className="upload_page">
        <NavBar />
        <div className="upload_page_items">
          <form className="form">
            {/* DISPLAY IMAGE */}
            <div>
              <input
                required
                type="file"
                ref={hiddenDisplayImageInput}
                onChange={handleChangeDisplayImage}
                style={{ display: "none" }}
              />
              {/* GRID IMAGE */}
              <input
                type="file"
                ref={hiddenGridImageInput1}
                onChange={handleChangeGridImage1}
                style={{ display: "none" }}
              />
              <input
                type="file"
                ref={hiddenGridImageInput2}
                onChange={handleChangeGridImage2}
                style={{ display: "none" }}
              />
              <input
                type="file"
                ref={hiddenGridImageInput3}
                onChange={handleChangeGridImage3}
                style={{ display: "none" }}
              />
            </div>
            <h1>UPLOAD A NEW CHARACTER</h1>
            <div className="upload-gallery">
              {displayImage == null ? (
                <div onClick={handleDisplayClick} className="card-image-button">
                  <TfiPlus className="card-image-icon" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(displayImage)}
                  onClick={handleDisplayClick}
                  className="card-image"
                />
              )}

              {gridImage1 == null ? (
                <div onClick={handleGridClick1} className="card-image-button">
                  <TfiPlus className="card-image-icon" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(gridImage1)}
                  onClick={handleGridClick1}
                  className="card-image"
                />
              )}
              {gridImage2 == null ? (
                <div onClick={handleGridClick2} className="card-image-button">
                  <TfiPlus className="card-image-icon" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(gridImage2)}
                  onClick={handleGridClick2}
                  className="card-image"
                />
              )}
              {gridImage3 == null ? (
                <div onClick={handleGridClick3} className="card-image-button">
                  <TfiPlus className="card-image-icon" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(gridImage3)}
                  onClick={handleGridClick3}
                  className="card-image"
                />
              )}
            </div>
            {/* <div className="title">Display Picture</div> */}
            <div className="field-container">
              {reqFail && (
                <span style={{ color: "red" }}>
                  * Required field/fields are empty
                </span>
              )}
              <span>(All fields are required unless specified)</span>
              <label className="chara-field-container">
                <input
                  required
                  type="text"
                  value={charaName}
                  placeholder="Name"
                  className="chara-field"
                  onChange={(e) => setCharaName(e.target.value)}
                />
              </label>
              <span className="label">
                Note: you cant have mods tag selected along with vanilla tag
              </span>
              <div className="chara-mods">
                <span className="label">Mods:</span>
                <div className="checkboxes">
                  <label className="checkbox">
                    EPE
                    <input
                      type="checkbox"
                      checked={isCheckedMod1}
                      onChange={handleChangeMod1}
                    />
                  </label>
                  <label className="checkbox">
                    CFP
                    <input
                      type="checkbox"
                      checked={isCheckedMod2}
                      onChange={handleChangeMod2}
                    />
                  </label>
                  <label className="checkbox">
                    Vanilla
                    <input
                      type="checkbox"
                      checked={isCheckedVanilla}
                      onChange={handleChangeVanilla}
                    />
                  </label>
                </div>
              </div>
              <div className="chara-sex">
                <span className="label">Sex:</span>
                <div className="checkboxes">
                  <label className="checkbox">
                    Male
                    <input
                      type="checkbox"
                      checked={isCheckedMale}
                      onChange={handleChangeMale}
                    />
                  </label>
                  <label className="checkbox">
                    Female
                    <input
                      type="checkbox"
                      checked={isCheckedFemale}
                      onChange={handleChangeFemale}
                    />
                  </label>
                </div>
              </div>
              <label
                className="chara-field-container"
                style={{ width: "100%" }}
              >
                <textarea
                  className="chara-field"
                  style={{ width: "100%" }}
                  placeholder="Description (Opt.)"
                  type="text"
                  value={description}
                  rows="10"
                  cols="50"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label
                className="chara-field-container"
                style={{ width: "100%" }}
              >
                <textarea
                  className="chara-field"
                  style={{ width: "100%" }}
                  placeholder="Dna"
                  required
                  type="text"
                  value={dna}
                  rows="50"
                  cols="50"
                  onChange={(e) => setDna(e.target.value)}
                />
              </label>
              {/* <span>{postId}</span> */}
              <div className="button-container">
                <button
                  className="form-submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? <span>LOADING</span> : <span>SUMBIT</span>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

