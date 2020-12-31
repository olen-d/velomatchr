import React from "react";

import { Checkbox, Form } from "semantic-ui-react";

import CheckboxToggle from "./formFields/checkboxToggle";

import useForm from "../hooks/useForm";

const EmailNotificationCheckboxes = () => {

  const labels = [
    "I have new riding buddy requests",
    "I have new potential matches",
    "Someone accepts my riding buddy request"
  ]



  return(
    <Form>
        {
          labels.map((label, index) => (
            <CheckboxToggle labelText={label} key={index} />
          ))
        }
      <Checkbox toggle label={<label>I have new riding buddy requests</label>} />
      <Checkbox toggle label={<label>I have new potential matches</label>} />
      <Checkbox toggle label={<label>Someone accepts my riding buddy request</label>} />
    </Form>
  );
}

export default EmailNotificationCheckboxes;
