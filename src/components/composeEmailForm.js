import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

import {
  useHistory,
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
  import SuccessContainer from "./successContainer";

  import useForm from "./../hooks/useForm";

const ComposeEmailForm = props => {
  const { colWidth, formTitle } = props;

  const [addresseeId, setAddresseeId] = useState(null);
  const [addresseeProxy, setAddresseeProxy] = useState(null);
  const [addresseeFirstName, setAddresseeFirstName] = useState(null);
  const [addresseeLastInitial, setAddresseeLastInitial] = useState(null);
  const [flag, setFlag] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  const [isTransportError, setIsTransportError] = useState(null);
  const [requesterProxy, setRequesterProxy] = useState(null);
  const [userId, setUserId] = useState(null);

  const { id } = useParams();

  const { authTokens: token } = useAuth();

  const { user } = auth.getUserInfo(token);

  const initialValues = { body: "", subject: "Let's Ride Together" }

  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();

  const history = useHistory();
  
  const handleDiscard = () => {
    history.push("/matches");
  }

  const handleSubmit = async () => {
    // Send requester proxy
    // Send addressee proxy
    // Send subject
    // Send message
    const { body, subject } = values;
    const formData = { addresseeProxy, body, requesterProxy, subject };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/match`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (json.errors) {
        setIsTransportError(false);
        const { errors } = json;
        handleServerErrors(...errors);
      } else if (json.status !== 200) {
        setIsErrorHeader("Unable to Send Email");
        setIsErrorMessage("Something went wrong, but it's probably not your fault. Please try again in a few seconds.");
        setIsTransportError(true);
      } else {
        // Great success!
        setIsTransportError(false);
        setIsSuccessHeader("Email Sent");
        setIsSuccessMessage(`Your message was successfully sent to ${addresseeFirstName} ${addresseeLastInitial}.`);
        setIsSuccess(true);
        // Redirect back to the matches page in like five seconds
      }
    } catch(error) {
      // TODO: Deal with the fetch error
    }
  }

  useEffect(() => { setAddresseeId(id); }, [id]);
  useEffect(() => { setUserId(user); }, [user]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  // Get email proxies
  useEffect(() => {
    if (userId && addresseeId) {
      (async () => {
        try {
          const responseAddressee = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${addresseeId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const jsonAddressee = responseAddressee.ok ? await responseAddressee.json() : null;
          const { user: { firstName, lastName}, } = jsonAddressee;
          const lastInitial = lastName.slice(0,1);
          setAddresseeFirstName(firstName);
          setAddresseeLastInitial(lastInitial);

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/id/${userId}/${addresseeId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const json = response.ok ? await response.json() : setRequesterProxy("error");
          const { data: [{ emailProxy }], } = json;

          if (!emailProxy) {
            // Need to create proxy
            const formData = { requesterId: userId, addresseeId };

            try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy`, {
                method: "post",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
              });
              const json = response.ok ? await response.json() : null;
              const { data: [{ requesterProxy, addresseeProxy }], } = json;

              setAddresseeProxy(addresseeProxy);
              setRequesterProxy(requesterProxy);
            } catch(error) {
              // TODO: deal with the error
            }
          } else {
            setRequesterProxy(emailProxy);
            try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/id/${addresseeId}/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
      
              const json = response.ok ? await response.json() : setRequesterProxy("error");
              const { data: [{ emailProxy }], } = json;

              if (!emailProxy) {
                // TOTO: Set server errors to return an error, also wire in the front end to show the error
              } else {
                setAddresseeProxy(emailProxy);
              }
            } catch(error) {
              // TODO: deal with adressee proxy request error
            }
          }
        } catch(error) {
          // TODO: deal with the error
        }
      })()
    }
  }, [addresseeId, token, userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && !isTransportError) {
      setIsErrorHeader("Unable to Send Email");
      setIsErrorMessage("Please check the values in the fields shown in red.");
    }
  }, [isError, isTransportError]);

  if (flag) {
    initializeFields(initialValues);
    setFlag(false);
  }

  return(
    <Grid.Column width={colWidth}>
      <Header
        as="h2"
        textAlign="left"
        color="orange"
      >
        {formTitle}
      </Header>
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
      <p>
        To: {addresseeFirstName} {addresseeLastInitial}.
      </p>
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
        <Button
          disabled={isError || !values.body}
          type="button"
          color="red"
          size="medium"
          icon="paper plane"
          labelPosition="left"
          content="Send"
          onClick={handleSubmit}
        >
        </Button>
        <Button
          type="button"
          size="medium"
          icon="trash"
          labelPosition="left"
          content="Discard"
          onClick={handleDiscard}
        >
        </Button>
      </Form>
    </Grid.Column>
  );
}

export default ComposeEmailForm;
