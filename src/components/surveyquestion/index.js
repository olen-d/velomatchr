import React from "react";
// import "./styles.css";

function SurveyQuestion(props) {
  return (
    <div className="survey-card">
      <div className="survey-question">
            <p>
              Statement&nbsp;{props.number}
            </p>
            <p>
              {props.text}
            </p>
      </div>
      <div className="survey-options">
        {props.children}
      </div>
    </div>
  );
}

export default SurveyQuestion;
