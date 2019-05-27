import React from "react";
// import "./styles.css";

function LikertItem(props) {
  return (
    <option 
        key={props.id} 
        value={props.number}
    >
        {props.number + ". " + props.text}
    </option>
  );
}

export default LikertItem;
