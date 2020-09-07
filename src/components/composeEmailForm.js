import React, { useContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";

import {
    Button,
    Form,
    Grid,
    Header,
    Message,
    Segment
  } from "semantic-ui-react";
  
  import { AuthContext } from "../context/authContext";

  import BodyTextarea from "./formFields/bodyTextarea";
  import ErrorContainer from "./errorContainer";
  import SubjectInput from "./formFields/subjectInput";

  import useForm from "./../hooks/useForm";

const ComposeEmailForm = props => {
  const { colWidth, formTitle } = props;

  const [flag, setFlag] = useState(true);


  const initialValues = { body: "", subject: "Let's Ride Together" }

  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();
  
  if (flag) {
    initializeFields(initialValues);
    setFlag(false);
  }

  return(
    <Grid.Column width={colWidth}>
      <Header
        as="h2"
        textAlign="center"
        color="orange"
      >
        {formTitle}
      </Header>
      <Form size="large">
        <SubjectInput
          errors={errors}
          initialValue={values.subject}
          placeholder="Add a subject"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />
        <BodyTextarea
          errors={errors}
          initialValue={values.body}
          placeholder="Type a message"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />
      </Form>
    </Grid.Column>
  );
}

export default ComposeEmailForm;
