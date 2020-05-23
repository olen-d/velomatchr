import React, { useEffect, useState } from "react";
//TODO: import PropTypes from "prop-types"

import { Button, Form, Icon, Modal } from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import PasswordVerifyInput from "./formFields/passwordVerifyInput";

import useForm from "../hooks/useForm";

const warning = {
  color: "#d9b500"
}

const ConfirmPasswordModal = props => {
  const { actionNegative, actionPositive, handleClose, header, isOpen, message } = props;

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
    // Check the password
    // values.passwordVerify
    // If it's wrong, error
    // If it's right close the modal
    // And update the password
    // Confirmation success
    handleClose();
    // return true... maybe some sort of isPasswordConfirmed?
  }

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.passwordVerify) {
      setIsErrorHeader("Invalid Password");
      setIsErrorMessage("Please entered a valid password and try again.");
    }
  }, [errors.passwordVerify, isError]);

  return(
    <Modal
      open={isOpen}
      onClose={handleClose} closeIcon
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
      <p>Values: {values.passwordVerify}</p>
    </Modal>
  )
}

export default ConfirmPasswordModal;
