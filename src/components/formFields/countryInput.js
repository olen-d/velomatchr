import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const CountryInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const [countries, setCountries] = useState([]);

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
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
