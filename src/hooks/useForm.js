import { useState } from "react";

const useForm = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleBlur = async (isError, event) => {
    const { target: { name }, } = event;

    const isErrorResult = await isError;
    
    setErrors({
      ...errors,
      [name]: isErrorResult
    });
  }

  const handleChange = event => {
    const { target: { name, value }, } = event;
    setValues({
      ...values,
      [name]: value
    });
  }

  const handleUpdateValues = newValues => {
    setValues({
      ...values,
      ...newValues
    })

  }

  const handleServerErrors = serverErrors => {
    setErrors({
      ...errors,
      ...serverErrors
    })
  }

  const initializeFields = initialValues => {
    setValues({
      ...initialValues
    });
  }

  return {
    values,
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    handleUpdateValues,
    initializeFields
  }
}

export default useForm;
