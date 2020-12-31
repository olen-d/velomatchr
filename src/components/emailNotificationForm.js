import React from "react";
import PropTypes from "prop-types";

import { Button } from "semantic-ui-react";

import CheckboxToggle from "./formFields/checkboxToggle";

import useForm from "../hooks/useForm";

const checkboxStyle = { marginBottom: "1rem" }

const EmailNotificationCheckboxes = props => {
  const { submitBtnContent } = props;

  const { handleCheckboxChange, values } = useForm();

  const handleSubmit = () => {
    //
  }

  const options = [
    ["newRequest", "I have new riding buddy requests"],
    ["newMatch", "I have new potential matches"],
    ["newBuddy", "Someone accepts my riding buddy request"]
  ]

  return(
      <div>
        {
          options.map(([name, label], index) => (
            <CheckboxToggle label={label} style={checkboxStyle} name={name} handleChange={handleCheckboxChange} key={`checkbox${index}`} />
          ))
        }
        <Button
          disabled={Object.entries(values).length < 1}
          className="fluid"
          type="button"
          color="red"
          size="large"
          icon="check circle"
          labelPosition="left"
          content={submitBtnContent}
          onClick={handleSubmit}
        >
        </Button>
      </div>
  );
}

EmailNotificationCheckboxes.defaultProps = {
  submitBtnContent: "Update Email Notifications"
};

const { string } = PropTypes;

EmailNotificationCheckboxes.propTypes = {
  submitBtnContent: string
}

export default EmailNotificationCheckboxes;
