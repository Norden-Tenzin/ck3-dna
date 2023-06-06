import React from "react";
// style
import "../style/Tags.scss";
// internal
import Tag from "./Tag";

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
