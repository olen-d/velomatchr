import React, { useState } from "react";

import { Form, Popup } from "semantic-ui-react";

const FullnameInput = props => {
  const { placeholder } = props;

  const [ fullname, setFullname ] = useState("");
  const [ isFullnameError, setIsFullnameError ] = useState(false);

  const handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    
    setFullname(value);
    // setValues({
    //   ...values,
    //   [name]: value
    // });
  }

  return(
    <Form size="large"> 
      <Popup
        trigger={
          <Form.Input
            className="fluid"
            icon="user"
            iconPosition="left"
            name="fullname"
            value={fullname}
            placeholder={placeholder}
            error={isFullnameError}
            onChange={handleChange}
          />
        }
        content="Seperate first and last names with a space."
        on="focus"
      />
    </Form>
  );
}

FullnameInput.defaultProps = {
  placeholder: "First and Last Name"
}

export default FullnameInput;
