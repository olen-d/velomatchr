import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// TODO: Remove all FormInput
// TODO: Delete FormInput from src/components

import auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import ProfileRequiredForm from "./profileRequiredForm";
import { Grid } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import FormInput from "./formInput";
import UsernameInput from "./formFields/usernameInput";

import useForm from "../hooks/useForm";

const ProfileFullForm = () => {
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [gender, setGender] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [phone, setPhone] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);
  const [postalCode, setPostalCode] = useState(null);  
  const [state, setState] = useState(null);


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

        setInitialValues({ username });

        // Delete below when incorporated into initialvalues
        setCity(city);
        setCountry(country);
        setFullName(firstName + " " + lastName);
        setGender(gender);
        setLatitude(latitude);
        setLongitude(longitude);
        setPhone(phone);
        setPhotoLink(photoLink);
        setPostalCode(postalCode);
        setState(state);
      }
    }
    getUserProfile();
  }, [userId]);

  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }
  
  return(
    <>
      <Grid.Row>
        <ProfilePhotoForm
          colWidth={8}
          formTitle={"Current Photograph"}
          profilePhotoBtnContent={"Upload Profile Photo"}
          photoLink={photoLink}
          userId={userId}
        />
      </Grid.Row>
      <Grid.Row>
      <UsernameInput 
        errors={errors}
        initialValue={values.fullname}
        placeholder="First and Last Name"
        handleBlur={handleBlur}
        handleChange={handleChange}
        values={values}
      />
      </Grid.Row>
      <Grid.Row>
      <ProfileRequiredForm
          colWidth={8}
          formTitle={"My Profile"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"phone"}
          inputValue={phone}
          name={"phone"}
          placeholder={"Phone Number"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"building"}
          inputValue={city}
          name={"city"}
          placeholder={"City"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"map pin"}
          inputValue={state}
          name={"state"}
          placeholder={"State"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"flag"}
          inputValue={country}
          name={"country"}
          placeholder={"Country"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"map pin"}
          inputValue={postalCode}
          name={"postalcode"}
          placeholder={"Postal Code"}
        />
      </Grid.Row>
    </>
  );
}

export default ProfileFullForm;
