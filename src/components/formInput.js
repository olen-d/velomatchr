import React, { useEffect, useState } from "react";

import { Form } from "semantic-ui-react";

const FormInput = props => {
    const { icon, inputValue, name, placeholder } = props;
  
    const [value, setValue] = useState("");
  
    useEffect(() =>{
      if (inputValue) {
        setValue(inputValue);
      }
    }, [inputValue])
  
    return(
      <Form
        size="large"
      >
        <Form.Input
          className="fluid"
          {...(icon && { icon, iconPosition: "left" })}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={e => {
            setValue(e.target.value)
          }}
        />
      </Form>
    );
  }

  export default FormInput;
