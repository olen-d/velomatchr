import React, { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import ConfirmPasswordModal from "./confirmPasswordModal";
import EmailInput from "./formFields/emailInput";
import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const UpdateEmailAddressForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isInitialValuesSet, setIsInitalValuesSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassVerified, setIsPassVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMesssage] = useState(null);
  const [userId, setUserId] = useState(null);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    initializeFields,
    values
  } = useForm();

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);
  
  const handleSubmit = () => {
    if (!isError) {
      setIsModalOpen(true);
    } else {
      // TODO: return failure
    }
  }
  
  const postUpdate = useCallback(() => {
    const { email } = values;
    const formData = { userId, email };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        const { errors } = data;
        setIsSuccess(false);
        setIsErrorHeader("Unable to Update Email Address");
        setIsErrorMessage("Please enter a valid email address and try again.")
        handleServerErrors(...errors);
      } else {
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        } else {
          setIsSuccessHeader("Your Email Address was Successfully Updated");
          setIsSuccessMesssage("You can now login using your updated email address.");
          setIsSuccess(true);
        }
      }
    })
    .catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }, [handleServerErrors, setDoRedirect, setRedirectURL, submitRedirect, submitRedirectURL, userId, values]);

  const handleIsPassVerified = isAuthenticated => {
    setIsPassVerified(isAuthenticated);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserAccount = async () => {
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
    getUserAccount();
  }, [token, userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.email) {
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
    setIsInitalValuesSet(true);
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

UpdateEmailAddressForm.propTypes = {
  formTitle: PropTypes.string, 
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool, 
  submitRedirectURL: PropTypes.string
}

export default UpdateEmailAddressForm;
