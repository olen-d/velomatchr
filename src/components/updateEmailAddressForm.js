import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import ConfirmPasswordModal from "./confirmPasswordModal";
import EmailInput from "./formFields/emailInput";
import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const UpdateEmailAddressForm = props => {
  const { formTitle, handleVerifyEmailFormVisibility, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassVerified, setIsPassVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMesssage] = useState(null);
  const [userId, setUserId] = useState(user);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    initializeFields,
    values
  } = useForm();
  
  const handleSubmit = async () => {
    const { email } = values;

    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
    if (isNewAccessToken) { setAccessToken(token); }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/is-available/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      const isAvailableData = response.ok ? await response.json() : null;
    
      const { status: isAvailableStatus, data: { isAvailable }, } = isAvailableData;
  
      if (isAvailableStatus === 200 && !isAvailable) { handleServerErrors(...[{ email: true }]) }
  
      if (!isError && isAvailable) {
        setIsModalOpen(true);
      } else {
        // TODO: return failure
      }
    } catch(error) {
      return ({
        status: 500,
        message: "Internal Server Error",
        error
      });
    }
  }
  
  const postUpdate = useCallback(() => {
    const { email } = values;

    if (userId) {
      const formData = { userId, email };

      (async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }
  
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/update`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
  
          const data = response.ok ? await response.json() : null;
  
          if (data.status !== 200) {
            setIsSuccess(false);
            setIsErrorHeader("Unable to Update Email Address");
            setIsErrorMessage("Please enter a valid email address and try again.")
            handleServerErrors(...[{ email: true }]);
          } else {
            // Set isVerified to 0
            const isVerifiedFormData = {
              id: userId,
              isEmailVerified: 0
            }
    
            const isVerifiedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verified/update`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(isVerifiedFormData)
            });

            if (isVerifiedResponse !== 200) {
              //TODO: Deal with the error...
            }

            // Send verification to the new email address
            const sendVerificationEmailResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/send/verification`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
                body: JSON.stringify(formData)
              });
            if (sendVerificationEmailResponse.ok) {
              // Display the verification form
              handleVerifyEmailFormVisibility(true);
            } else {
              // Email sending failure
              // Some kind of try again message
            }
            if(submitRedirect) {
              setRedirectURL(submitRedirectURL);
              setDoRedirect(true);
            } else {
              setIsSuccessHeader("Your Email Address was Successfully Updated");
              setIsSuccessMesssage("You can now login using your updated email address.");
              setIsSuccess(true);
            }
          }
        } catch(error) {
            return ({
              status: 500,
              message: "Internal Server Error",
              error
            });
        }
      })();
    }
  }, [accessToken, handleServerErrors, handleVerifyEmailFormVisibility, setAccessToken, setDoRedirect, setRedirectURL, submitRedirect, submitRedirectURL, userId, values]);

  const handleIsPassVerified = isAuthenticated => {
    setIsPassVerified(isAuthenticated);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    const getUserAccount = async () => {
      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
      if (isNewAccessToken) { setAccessToken(token); }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
        const {
          user: {
            email
          },
        } = data;

        setInitialValues({
          email
        });
      }
    }
    if (userId) { getUserAccount(); }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError) { setIsSuccess(false); }
    if (errors.email) {
      setIsErrorHeader("Invalid Email Address");
      setIsErrorMessage("Please check the email address you entered and try again.");
    }
  }, [errors.email, isError]);

  useEffect(() => {
    if(isPassVerified === true) {
      postUpdate();
      setIsPassVerified(false);
    }
  }, [isPassVerified, postUpdate]);

  if (Object.keys(initialValues).length > 0 && !isInitialValuesSet) {
    initializeFields(initialValues);
    setIsInitialValuesSet(true);
  }

  return(
    <>
      <Header 
        as="h3" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <SuccessContainer
        header={isSuccessHeader}
        message={isSuccessMessage}
        show={isSuccess}
      />
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
          <ConfirmPasswordModal
            actionNegative={"Cancel"}
            actionPositive={"Submit"}
            handleClose={handleClose}
            handleIsPassVerified={handleIsPassVerified}
            header={"Password Required"}
            isOpen={isModalOpen}
            message={"Please enter your password."}
            userId={userId}
          />
        </Form>
      </Segment>
    </>
  );
}

UpdateEmailAddressForm.defaultProps = {
  formTitle: "My Email Address",
  submitBtnContent: "Update Email Address",
  submitRedirect: false,
  submitRedirectURL: ""
}

const { bool, func, string } = PropTypes;

UpdateEmailAddressForm.propTypes = {
  formTitle: string,
  handleVerifyEmailFormVisibility: func,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default UpdateEmailAddressForm;
