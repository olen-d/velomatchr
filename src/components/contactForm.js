import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import {
  Button,
  Form,
  Grid,
  Message
} from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import BodyTextarea from "./formFields/bodyTextarea";
import EmailInput from "./formFields/emailInput";
import ErrorContainer from "./errorContainer";
import FullnameInput from "./formFields/fullnameInput";
import SubjectInput from "./formFields/subjectInput";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const ContactForm = props => {
  const { colWidth, mailbox, messageHeader, messageBody } = props;

  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  const [isTransportError, setIsTransportError] = useState(false);

  const { errors, handleBlur, handleChange, values } = useForm();

  const { accessToken, setAccessToken } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  const handleSubmit = async () => {
    if (isError) {
      // Fail
      return false;
    } else {
      const { body, email, fullname, subject } = values;
      const message = `${body} <p>From ${fullname}</p><p>User Id: ${user}`;

      const formData = {
        fromAddress: email,
        toAddress: mailbox,
        subject,
        message
      };

      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
      if (isNewAccessToken) { setAccessToken(token); }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const json = response.ok ? await response.json() : null;

        if (json) {
          if (json.status !== 200) {
            setIsSuccess(false);
            setIsErrorHeader("Unable to Send Email");
            setIsErrorMessage("Something went wrong, but it's probably not your fault. Please try again in a few seconds.");
            setIsTransportError(true);
          } else {
            setIsTransportError(false);
            setIsSuccessHeader("Email Sent");
            setIsSuccessMessage("Your message was successfully sent to VeloMatchr World Headquarters.");
            setIsSuccess(true);
          }
        } else {
          // Fail
        }
      } catch (error) {
        // Fail
      }
    }
  };

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError) {
      if (errors.body) {
        setIsErrorHeader("Invalid Message");
        setIsErrorMessage("Please enter a message and try again.");
      }
      if (errors.email) {
        setIsErrorHeader("Invalid Email Address");
        setIsErrorMessage("Please check the email address you entered and try again.");
      }
      if (errors.fullname) {
        setIsErrorHeader("Invalid Name");
        setIsErrorMessage("Please enter a name that is at least two letters long.");
      }
      if (errors.subject) {
        setIsErrorHeader("Invalid Subject");
        setIsErrorMessage("Please enter a subject with at least one letter.");
      }
    } else {
      setIsErrorHeader(null);
      setIsErrorMessage(null);
    }
  }, [errors, isError]);

  return(
    <>
      <Grid.Row>
        <Grid.Column width={8}>
          <ErrorContainer
            header={isErrorHeader}
            message={isErrorMessage}
            show={isError || isTransportError }
          >
          </ErrorContainer>
          <SuccessContainer
            header={isSuccessHeader}
            message={isSuccessMessage}
            show={isSuccess}
          >
          </SuccessContainer>
          <Form size="large">
            <FullnameInput
              errors={errors}
              initialValue={values.fullname}
              placeholder="First and Last Name"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
            />
            <EmailInput 
              errors={errors}
              initialValue={values.email}
              placeholder="Email Address"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
            />
            <SubjectInput
              errors={errors}
              initialValue={values.subject}
              placeholder="Add a subject"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
            />
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          <Message>
            <Message.Header>
              {messageHeader}
            </Message.Header>
            <p>
              {messageBody}
            </p>
          </Message>
          <Form size="large">
            <BodyTextarea
              errors={errors}
              initialValue={values.body}
              placeholder="Type a message..."
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
            />
            <Button
              disabled={isError || !values.body}
              type="button"
              color="red"
              size="medium"
              icon="paper plane"
              labelPosition="left"
              content="Send"
              onClick={handleSubmit}
            ></Button>
          </Form>
      </Grid.Column>
    </Grid.Row>
  </>
  );
}

ContactForm.defaultProps = {
  colWidth: 16,
  mailbox: null,
  messageBody: "The content, name, or URL you were looking for or action you were trying to take.",
  messageHeader: "What were you looking for?"
};

const { number, string } = PropTypes;

ContactForm.propTypes = {
  colWidth: number,
  mailbox: string,
  messageBody: string,
  messageHeader: string
};

export default ContactForm;
