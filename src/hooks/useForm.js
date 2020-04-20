import { useState } from "react";

const useForm = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  return {
    values,
    setValues,
    errors,
    setErrors
  }
}

export default useForm;
