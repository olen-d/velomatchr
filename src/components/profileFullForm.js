import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// TODO: Remove all FormInput
// TODO: Delete FormInput from src/components

import auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import { Button, Form, Header } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import CityInput from "./formFields/cityInput";
import CountryInput from "./formFields/countryInput"
import FullnameInput from "./formFields/fullnameInput";
import GenderInput from "./formFields/genderInput";
import PhoneInput from "./formFields/phoneInput";
import PostalCodeInput from "./formFields/postalCodeInput";
import StateInput from "./formFields/stateInput";
import UsernameInput from "./formFields/usernameInput";

import useForm from "../hooks/useForm";

const ProfileFullForm = props => {
  const { formTitle, submitBtnContent } = props;

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);

  // New state (TODO: Delete this line)
  const [flag, setFlag] = useState(true);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState(null);
  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`);
      const data = await response.json();

      if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
        const {
          user: {
            city,
            country,
            firstName,
            lastName,
            gender,
            latitude,
            longitude,
            name: username,
            phone,
            photoLink,
            postalCode,
            state
          },
        } = data;

        const fullname = firstName || lastName ? `${firstName} ${lastName}` : "";

        setInitialValues({ city, country, fullname, gender, phone, postalCode, state, username });

        // Delete below when incorporated into initialvalues
        setLatitude(latitude);
        setLongitude(longitude);
        setPhotoLink(photoLink);
      }
    }
    getUserProfile();
  }, [userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);
  
  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }
  
  const handleSubmit = () => {
    if (!isError) {
      postProfileUpdate();
    } else {
      // TODO: return failure
    }
  }

  const postProfileUpdate = () => {
    // Need to add route
    // Need to add controller
  }

  return(
    <>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <ProfilePhotoForm
        formTitle={"Current Photograph"}
        profilePhotoBtnContent={"Upload Profile Photo"}
        photoLink={photoLink}
        userId={userId}
      />
      <Form size="large">
        <UsernameInput 
          errors={errors}
          initialValue={values.fullname}
          placeholder="User Name"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />
        
        <FullnameInput
          errors={errors}
          initialValue={values.fullname}
          placeholder="First and Last Name"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />

        <GenderInput 
          errors={errors}
          initialValue={values.gender} 
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />

        <PhoneInput
          errors={errors}
          initialValue={values.phone}
          placeholder="Phone Number"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />

        <CityInput
          errors={errors}
          initialValue={values.city}
          placeholder="City"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />
        
        <StateInput
          errors={errors}
          initialValue={values.state}
          placeholder="State"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />

        <CountryInput
          errors={errors}
          initialValue={values.country}
          placeholder="Country"
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
        />

        <PostalCodeInput
          errors={errors}
          initialValue={values.postalCode}
          placeholder="Postal Code"
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
      </Form>
    </>
  );
}

export default ProfileFullForm;
