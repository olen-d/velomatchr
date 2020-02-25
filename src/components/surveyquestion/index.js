import React, { useEffect, useState } from "react";
import "./styles.css";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemExtra,
  ItemHeader,
  Form
} from "semantic-ui-react";

const grey = {
  color: "#767676"
}
const red = {
  color: "#db2828"
}

const SurveyQuestion = props => {
  const {answer, id, number, onChange, text, validate } = props;

  const [isError, setIsError] = useState(false);
  const [itemTextColor, setItemTextColor] = useState(grey);

  useEffect(() => {
    if (validate) {
      if(!answer.find(x => x.id === id).selectedVal) {
        setIsError(true);
        setItemTextColor(red);
      } else {
        setIsError(false);
        setItemTextColor(grey);
      }
    }
  }, [validate, answer, id]);

  return (
    <Item>
      <ItemContent>
        <ItemHeader
          as="h3"
          style={itemTextColor}
        >
          Statement&nbsp;{number}
        </ItemHeader>
        <ItemDescription style={itemTextColor}>
          <p className="survey-question">
            {text}
          </p>
        </ItemDescription>
        <ItemExtra 
          className="survey-response"
        >
          <Form.Input 
            className="fluid"
            control="select"
            name={id}
            value={answer.find(x => x.id === id).selectedVal || "default"}
            error={isError}
            onChange={onChange}
          >
            <option 
              key={-1}
              value="default" 
              disabled
            >
              Select an Option
            </option>
            {props.children}
          </Form.Input>
        </ItemExtra>
      </ItemContent>
    </Item>
  );
}

export default SurveyQuestion;
