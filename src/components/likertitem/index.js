import React from "react";
// import "./styles.css";

function LikertItem(props) {
  return (
    <div className="likert-item">
        <p>
            {props.number}&nbsp;{props.text}
        </p>
    </div>
  );
}

export default LikertItem;
