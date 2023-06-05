import React from "react";
import Tag from "./Tag";
import "../style/Tags.scss";

export default function Tags(props) {
  const { className, mods, tagClassName } = props;
  return (
    <div className={className || 'tag_holder'}>
      {mods
        ? mods.map((mod, index) => <Tag className={tagClassName || 'tag'} value={mod} key={index} />)
        : ""}
    </div>
  );
}
