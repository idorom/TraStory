import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import React from "react";

//Helper method- help TextField's attribute to change color for indication
function isError(error) {
  if (error) return true;
  else return false;
}

let inputType = "text";
let size = 12;

const TextFieldForm = (props) => {
  if (props.inputType) inputType = props.inputType;
  if (props.size) size = props.size;

  return (
    <Grid item xs={size}>
      <TextField
        type={inputType}
        name={props.name}
        variant="outlined"
        fullWidth
        label={props.label}
        {...props.register(props.name)}
        className={`${props.textError ? "is-invalid" : ""}`}
        error={isError(props.textError)}
        helperText={props.helperText}
      />
    </Grid>
  );
};

export default TextFieldForm;
