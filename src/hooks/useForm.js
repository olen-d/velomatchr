import { useState } from "react";

const useForm = () => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});

  const handleBlur = async (isError, event) => {
    const { target: { name }, } = event;

    try {
      const isErrorResult = await isError;
    
      setErrors({
        ...errors,
        [name]: isErrorResult
      });
    } catch(error) {
      console.log(error);
    }
  }

  const handleChange = event => {
    const { target: { name, value }, } = event;
    setValues({
      ...values,
      [name]: value
    });
  }

  const handleClearInput = name => {
    setValues({
      ...values,
      [name]: null
    })
  }

  const handleServerErrors = serverErrors => {
    setErrors({
      ...errors,
      ...serverErrors
    })
  }

  const handleUpdateValues = newValues => {
    setValues({
      ...values,
      ...newValues
    })

  }

  const initializeFields = initialValues => {
    setValues({
      ...initialValues
    });
  }

  return {
    errors,
    handleBlur,
    handleChange,
    handleClearInput,
    handleServerErrors,
    handleUpdateValues,
    initializeFields,
    values
  }
}

export default useForm;
