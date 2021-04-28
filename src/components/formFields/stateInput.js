import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const StateInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const [states, setStates] = useState([]);

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  useEffect(()=> {
    (async ()=> {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/states`);

      const responseJson = response.status === 200 ? await response.json() : false;

      if (responseJson && responseJson.status === 200) {
        const { data } = responseJson;
        setStates([...data]);
      } else {
        // TODO: Deal with the error 
      }
    })();
  }, []);

  return(
    <>
      <Form.Input
        autoComplete="new-user-state"
        className="fluid"
        error={errors.state}
        icon="map pin"
        iconPosition="left"
        list="states"
        name="state"
        onBlur={(event) => handleBlur(validate(event), event)}
        onChange={handleChange}
        placeholder={placeholder}
        value={values.state || ""}
      />
      <datalist id="states">
        {states.map(({ code, name }) => { return <option key={code} value={name} /> })}
      </datalist>
    </>
  );
}

StateInput.defaultProps = {
  placeholder: "State"
}

const { func, string, object } = PropTypes;

StateInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default StateInput;
