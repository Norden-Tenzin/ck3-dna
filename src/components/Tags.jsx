import React from "react";
import Tag from "./Tag";
import "../style/Tags.scss";

export default function Tags(props) {
  const { className, mods } = props;
  return (
    <div className={className || 'tags_holder'}>
      {mods
        ? mods.map((mod, index) => <Tag className="tag" value={mod} key={index} />)
        : ""}
    </div>
  );
}
