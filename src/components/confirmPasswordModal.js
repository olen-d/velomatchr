import React from "react";
//TODO: import PropTypes from "prop-types"

import { Button, Form, Icon, Modal } from "semantic-ui-react";

import PasswordInput from "./formFields/passwordInput";

import useForm from "../hooks/useForm";

const warning = {
  color: "#d9b500"
}

const ConfirmPasswordModal = props => {
  const { actionNegative, actionPositive, header, isOpen, message } = props;

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const handleClose = () => {
    // Pass closed back up...
  }

  const handleConfirm = () => {
    // Check the password
    // If it's wrong, error
    // If it's right close the modal
    // And update the password
  }

  return(
    <Modal
      open={isOpen}
      onClose={handleClose} closeIcon
    >
      <Modal.Header><span style={warning}><Icon name="exclamation triangle" />&nbsp;{header}</span></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {message}
          <Form>
            <PasswordInput
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
        <Button color="orange" onClick={handleConfirm}>
          <Icon name="checkmark" /> {actionPositive}
          </Button>
        </Modal.Actions>

    </Modal>
  )
}

export default ConfirmPasswordModal;
