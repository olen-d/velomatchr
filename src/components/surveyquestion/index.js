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
        <select 
          id={"sl" + props.number}
          defaultValue={"default"}
        >
          <option 
            value="default" 
            disabled
          >
            Select an Option
          </option>
          {props.children}
        </select>
      </div>
    </div>
  );
}

export default SurveyQuestion;
