import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"

import { Button, Form, Icon, Modal } from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import PasswordVerifyInput from "./formFields/passwordVerifyInput";

import useForm from "../hooks/useForm";

const warning = {
  color: "#d9b500"
}

const ConfirmPasswordModal = props => {
  const {
    actionNegative,
    actionPositive,
    handleClose,
    handleIsPassVerified,
    header,
    isOpen,
    message,
    accessToken,
    userId 
  } = props;

  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const handleConfirm = () => {
    (async () => {
      const password = values.passwordVerify;
      const formData = { id: userId, password }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/password/authenticate`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      const { isAuthenticated } = data;

      handleIsPassVerified(isAuthenticated);

      if (isAuthenticated) {
        handleClose();
      } else {
        handleServerErrors({ passwordVerify: true });
      }
    })();
  }

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.passwordVerify) {
      setIsErrorHeader("Invalid Password");
      setIsErrorMessage("Please enter a valid password and try again.");
    }
  }, [errors.passwordVerify, isError]);

  return(
    <Modal
      open={isOpen}
      onClose={handleClose} closeIcon
      size={"tiny"}
    >
      <Modal.Header><span style={warning}><Icon name="exclamation triangle" />&nbsp;{header}</span></Modal.Header>
      <Modal.Content>
        <ErrorContainer
          header={isErrorHeader}
          message={isErrorMessage}
          show={isError}
        />
        <Modal.Description>
          <p>
            {message}
          </p>
          <Form>
            <PasswordVerifyInput
              errors={errors}
              initialValue={values.password}
              placeholder="Password"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}/>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={handleClose}>
          <Icon name="remove" /> {actionNegative}
        </Button>
        <Button
          disabled={isError}
          color="orange"
          onClick={handleConfirm}
        >
          <Icon name="checkmark" /> {actionPositive}
          </Button>
        </Modal.Actions>
    </Modal>
  )
}

ConfirmPasswordModal.defaultProps = {
  actionNegative: "Cancel",
  actionPositive: "Submit",
  header: "Password Required",
  isOpen: false,
  message: "Please enter your old password.",
  accessToken: "",
  userId: -99 
}

const { bool, func, number, string } = PropTypes;

ConfirmPasswordModal.propTypes = {
  actionNegative: string,
  actionPositive: string,
  handleClose: func,
  handleIsPassVerified: func,
  header: string,
  isOpen: bool,
  message: string,
  accessToken: string,
  userId: number
}

export default ConfirmPasswordModal;
