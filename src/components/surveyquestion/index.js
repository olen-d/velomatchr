import React from "react";
import "./styles.css";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemExtra,
  ItemHeader,
} from "semantic-ui-react"

const SurveyQuestion = props => {
  return (
    <Item>
      <ItemContent>
        <ItemHeader
          as="h3"
          className="grey"
        >
          Statement&nbsp;{props.number}
        </ItemHeader>
        <ItemDescription>
          <p className="survey-question">
            {props.text}
          </p>
        </ItemDescription>
        <ItemExtra 
          className="survey-response"
        >
          <select 
            id={"sl" + props.number}
            defaultValue={"default"}
            onChange={this.onChange}
          >
            <option 
              value="default" 
              disabled
            >
              Select an Option
            </option>
            {props.children}
          </select>
        </ItemExtra>
      </ItemContent>
    </Item>
  );
}

export default SurveyQuestion;
