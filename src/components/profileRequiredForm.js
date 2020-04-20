import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import DropdownItems from "./dropdownItems/dropdownItems";
import genderChoices from "../models/genderChoices";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Popup,
  Segment
} from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import ErrorContainer from "./errorContainer";
import FullnameInput from "./formFields/fullnameInput";
import GenderInput from "./formFields/genderInput";

// Custom hook - TODO: move this to it's own file and import

const useForm = ({ initialValues, onSubmit, validate }) => {
  const [userId, setUserId] = useState(null);
  const [values, setValues] = useState(initialValues || {});
  const [touchedValues, setTouchedValues] = useState({});
  const [errors, setErrors] = useState({});

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    
    setValues({
      ...values,
      [name]: value
    });
  }

  const handleBlur = event => {
    const target = event.target;
    const name = target.name;

    setTouchedValues({ 
      ...touchedValues,
      [name]: true
    });

    
  }

  const handleSubmit = event => {
    console.log("cheeseburger");
    event.preventDefault();
    const error = validate(values);
    onSubmit({ values, error});
  }

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`);
      const data = await response.json();

      if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
        const { user: { firstName, lastName, gender }, } = data;

        const fullName = firstName + " " + lastName;
        setValues({ fullName, gender });
      }
    }
    getUserProfile();
  }, [userId]);

  return {
    values,
    touchedValues,
    errors,
    handleChange,
    handleSubmit,
    handleBlur
  }
}

const ProfileRequiredForm = props => {
  const { colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;
  

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isFullNameError, setIsFullNameError] = useState(false);
  const [isGenderError, setIsGenderError] = useState(false);
  // ...Rest of the State
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("default");

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

 

  // New error stuff
  const {
    values,
    touchedValues,
    errors,
    // handleFetchedDataItem,
    handleChange,
    handleSubmit
  } = useForm({
    initialValues: {
      fullName: "",
      gender: "default"
    },
    onSubmit(values, errors) {
      console.log("ERRORS", errors);
      alert(JSON.stringify({ values, errors}, null, 2));
    },
    validate(values) {
      const errors = {};
      if (values.fullName.length < 6) {
        errors.fullName = "Please enter a name"
      }
      return errors;
    }
  })

  const postProfileRequired = () => {

    const formData = {
      userId,
      fullName, 
      gender,
    };

    // Form Validation
    let formError = false;

    if(fullName.length < 1) {
      setIsFullNameError(true);
      formError = true;
    } else {
      setIsFullNameError(false);
    }
    if(gender === "default") {
      setIsGenderError(true);
      formError = true;
    } else {
      setIsGenderError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to save your profile");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/required/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.errors) {
        const { errors } = data;
        errors.forEach(e => {
          if(e["error"] === "IVN") {
            setIsFullNameError(true);
          }
          if(e["error"] === "IVG") {
            setIsGenderError(true);
          }
        }); 
      } else {
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Message>
        {formInstructions}
      </Message>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <Segment>
        <Form
          size="large"
        >
          <Popup
            trigger={
              <Form.Input
              className="fluid"
              icon="user"
              iconPosition="left"
              name="fullName"
              value={values.fullName}
              placeholder="First and Last Name"
              error={isFullNameError}
              onChange={handleChange}
            />
            }
            content="Seperate first and last names with a space."
            on="focus"
          />
          <Popup
            trigger={
              <Form.Input
                className="fluid"
                control="select"
                name="gender"
                value={values.gender}
                error={isGenderError}
                onChange={handleChange}
              >  
                <option
                  key="-1"
                  value="default"
                  disabled
                >
                  Select Your Gender
                </option>
                {genderChoices.map(genderChoice => (
                  <DropdownItems 
                    key={genderChoice.id}
                    value={genderChoice.value}
                    text={genderChoice.text}
                  />
                ))}
              </Form.Input>              
            }
            content="VeloMatchr offers cyclists the option of matching with the same gender only. The gender chosen here will be used for same gender only matches."
            on="focus"
          />
          <Button
            disabled={!values.fullName || values.gender ==="default"}
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
        </Form>
      </Segment>
      <FullnameInput initialValue={values.fullName} placeholder="First and Last Name" />
      <GenderInput initialValue={values.gender} />
    </Grid.Column>
  );
}

ProfileRequiredForm.defaultProps = {
  colWidth: 6,
  formInstructions: "Only your first name and last initial will be displayed to other users. Your gender is never shown.",
  formTitle: "Your Profile",
  submitBtnContent:"Update Profile",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

ProfileRequiredForm.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string
}

export default ProfileRequiredForm;
