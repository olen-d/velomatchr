import React from "react";
// import "./styles.css";

function SurveyQuestion(props) {
  return (
    <div className="card">
      <div className="question">
            <p>
              Statement&nbsp;{props.number}
            </p>
            <p>
                {props.text}
            </p>
      </div>
      <div className="options">
          
      </div>
    </div>
  );
}

export default SurveyQuestion;
