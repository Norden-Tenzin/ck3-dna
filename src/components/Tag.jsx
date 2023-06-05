import React from "react";

export default function Tag(props) {
  return <p className={props.className}>{props.value.toUpperCase()}</p>;
}
