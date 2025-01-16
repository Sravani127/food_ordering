// Input.js
import React from "react";
import TextField from "@mui/material/TextField";

const Input = ({ field, form: { touched, errors }, ...props }) => {
  const errorText = touched[field.name] && errors[field.name];

  return (
    <TextField
      {...field}
      {...props}
      error={!!errorText}
      helperText={errorText}
    />
  );
};

export default Input;
