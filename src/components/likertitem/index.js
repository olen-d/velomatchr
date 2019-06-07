import React from "react";
// import "./styles.css";

const LikertItem = props => {
  return (
    <option
        value={props.number}
    >
        {props.number + ". " + props.text}
    </option>
  );
}

export default LikertItem;
