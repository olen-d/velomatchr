import React, { useEffect, useState } from "react";
// TODO: import PropTypes from "prop-types";


import { Button, Form, Header, Segment } from "semantic-ui-react";

import EmailInput from "./formFields/emailInput";
import PasswordInput from "./formFields/passwordInput";

import useForm from "../hooks/useForm";

const LoginInformationForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [isError, setIsError] = useState(false);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    handleUpdateValues,
    initializeFields,
    values
  } = useForm();

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  const handleSubmit = () => {
    if (!isError) {
      postUpdate();
    } else {
      // TODO: return failure
    }
  }
  
  const postUpdate = () => {
    //
  }

  return(
    <>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Segment>
        <Form size="large">
          <EmailInput 
            errors={errors}
            initialValue={values.email}
            placeholder="Email Address"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <PasswordInput 
            errors={errors}
            initialValue={values.password}
            placeholder="Password"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <Button
            disabled={isError}
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
        </Form>
      </Segment>
    </>
  );
}

// TODO: Add prop type checking
// TODO: Add default props

export default LoginInformationForm;
