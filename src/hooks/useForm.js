import { useState } from "react";

const useForm = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = event => {
    const { target: { name, value }, } = event
    
    setValues({
      ...values,
      [name]: value
    });
  }

  return {
    values,
    errors,
    setErrors,
    handleChange
  }
}

export default useForm;
