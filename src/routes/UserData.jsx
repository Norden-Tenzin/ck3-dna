import React from "react";
import CardPage from "./CardPage";

export default function UserData(props) {
  return (
    <div>
      <h1>Your Saved Characters</h1>
      {props.uid !== "" ? (
        <CardPage fieldName="authorId" condition="==" query={props.uid} />
      ) : (
        ""
      )}
    </div>
  );
}
