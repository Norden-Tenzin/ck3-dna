import React from "react";

export default function Tag(props) {
  return <div className="tag-container">{props.value.toUpperCase()}</div>;
}
