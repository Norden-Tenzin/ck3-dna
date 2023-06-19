import React, { useEffect } from "react";

export default function Ad() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "728px", height: "90px" }}
        data-ad-client="ca-pub-114234437311277"
        data-ad-slot="42837282224"
      ></ins>
    </div>
  );
}
