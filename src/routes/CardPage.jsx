import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import "./style/LaunchPage.css";

export default function CardPage() {
  const [images, setImages] = React.useState([]);
  const [loaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = (count = 10) => {
    const apiRoot = "https://api.unsplash.com";
    const accessKey = "DnDfcNJcANiOOmGQsJb7SuRH-UHtEkbeP1eTmIrm4-I";

    axios
      .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
      .then((res) => {
        setImages([...images, ...res.data]);
        setIsLoaded(true);
      });
  };

  const UnsplashImage = ({ url, key }) => (
    <div className="image-item" key={key}>
      <img src={url} />
    </div>
  );

  return (
    <div className="container">
      <InfiniteScroll
        dataLength={images}
        next={() => fetchImages(5)}
        hasMore={true}
        loader={
          <img
            src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
            alt="loading"
          />
        }
      >
        <div className="image-grid" style={{ marginTop: "30px" }}>
          {loaded
            ? images.map((image, index) => (
                <UnsplashImage url={image.urls.regular} key={index} />
              ))
            : ""}
        </div>
      </InfiniteScroll>
    </div>
  );
}
