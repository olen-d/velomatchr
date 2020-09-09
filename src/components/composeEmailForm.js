import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

import {
  useParams
} from "react-router-dom";

import auth from "./auth";

import {
    Button,
    Form,
    Grid,
    Header,
    Message,
    Segment
  } from "semantic-ui-react";
  
  import { useAuth } from "../context/authContext";

  import BodyTextarea from "./formFields/bodyTextarea";
  import ErrorContainer from "./errorContainer";
  import SubjectInput from "./formFields/subjectInput";

  import useForm from "./../hooks/useForm";

const ComposeEmailForm = props => {
  const { colWidth, formTitle } = props;

  const [addresseeId, setAddresseeId] = useState(null);
  const [addresseeProxy, setAddresseeProxy] = useState(null);
  const [flag, setFlag] = useState(true);
  const [requesterProxy, setRequesterProxy] = useState(null);
  const [userId, setUserId] = useState(null);

  const { id } = useParams();

  const { authTokens: token } = useAuth();

  const { user } = auth.getUserInfo(token);

  const initialValues = { body: "", subject: "Let's Ride Together" }

  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();

  useEffect(() => { setAddresseeId(id); }, [id]);
  useEffect(() => { setUserId(user); }, [user]);

  // Get email proxies
  useEffect(() => {
    if (userId && addresseeId) {
      (async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/requester/id/${userId}/${addresseeId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const json = response.ok ? await response.json() : setRequesterProxy("error");
          const { data: [{ emailProxy }], } = json;

          if (!emailProxy) {
            // Need to create proxy
            // setRequesterProxy
            // setAddresseeProxy
          } else {
            setRequesterProxy(emailProxy);
            // Now get the addressee proxy...
          }
        } catch(error) {
          // TODO: deal with the error
        }
      })()
    }
  }, [addresseeId, token, userId]);

  
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
      </Form>{userId} <br />{requesterProxy}
    </Grid.Column>
  );
}

export default ComposeEmailForm;
