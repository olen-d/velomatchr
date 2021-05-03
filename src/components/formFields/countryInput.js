import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const CountryInput = props => {
  const { errors, handleBlur, handleChange, handleUpdateValues, placeholder, values } = props;

  const [countries, setCountries] = useState([]);

  const validate = event => {
    const { target: { name }, } = event;
    const countryIndex = countries.findIndex(country => country.name === values[name]);
    const isError = countryIndex === -1 ? true : false;

    if (!isError) {
      const countryCode = countries[countryIndex].alpha2;
      handleUpdateValues({ countryCode })
    } else {
      handleUpdateValues({ countryCode: null });
    }

    return isError;
  }

  useEffect(() => {
    (async ()=> {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/countries`);

      const responseJson = response.status === 200 ? await response.json() : false;

      if (responseJson && responseJson.status === 200) {
        const { data } = responseJson;
        setCountries([...data])
      } else {
        // TODO: Deal with the error
      }
    })();
  }, []);

  return(
    <>
      <Form.Input
        autoComplete="new-user-country"
        className="fluid"
        error={errors.country}
        icon="flag"
        iconPosition="left"
        list="countries"
        name="country"
        onBlur={(event) => handleBlur(validate(event), event)}
        onChange={handleChange}
        placeholder={placeholder}
        value={values.country || ""}
      />
      <datalist id="countries">
        {countries.map(({ alpha2, name }) => { return <option key={alpha2} value={name} /> })}
      </datalist>
    </>
  );
}

CountryInput.defaultProps = {
  placeholder: "Country"
}

const { func, object, string } = PropTypes;

CountryInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default CountryInput;
