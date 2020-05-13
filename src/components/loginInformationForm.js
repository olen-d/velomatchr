import React from "react";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import EmailInput from "./formFields/emailInput";
import PasswordInput from "./formFields/passwordInput";

import useForm from "../hooks/useForm";

const LoginInformationForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    handleUpdateValues,
    initializeFields,
    values
  } = useForm();

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
        </Form>
      </Segment>
    </>
  );
}

export default LoginInformationForm;
