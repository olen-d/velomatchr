import { useState } from "react";

const useForm = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleBlur = (isError, event) => {
    const { target: { name }, } = event;

    setErrors({
      ...errors,
      [name]: isError
    });
  }

  const handleChange = event => {
    const { target: { name, value }, } = event;
    
    setValues({
      ...values,
      [name]: value
    });
  }

  return {
    values,
    errors,
    handleBlur,
    handleChange
  }
}

export default useForm;
