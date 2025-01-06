import { HeroBg, VideoBg } from "./ForgotPasswordElemments";
import Video from "../../videos/video.mp4";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import { useAuth } from "../../Contexts/AuthContexts";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(0),
    minHeight: "86vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3B2A1A",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#412F1D",
    "&:hover": {
      transition: "all 0.2s ease-in-out",
      background: "#3B2A1A",
      color: "#FE9A0F",
      fontWeight: "bold",
    },
  },
}));
const initialValues = {
  email: "",
};

export default function ForgotPassword() {
  const errorRequiredField = " הוא שדה חובה";
  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("מייל" + errorRequiredField)
      .email("מיי לא תקין"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  //Send to user's mail a message to reset password
  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      //Send to user's mail a message to reset password
      await resetPassword(data.email);
      setMessage("קישור לאיפוס סיסמה נשלח לך במייל");
      setLoading(false);
    } catch {
      console.log("error", e.message);
      setError("משתמש אינו קיים");
      history.push("/ForgotPassword");
      setLoading(false);
      return;
    }
  };

  //Helper method- help TextField's attribute to change color for indication
  function isError(error) {
    if (error) return true;
    else return false;
  }

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg>
          <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            דף איפוס סיסמה
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {message && (
                <Grid item xs={12}>
                  <Alert severity="success">{message}</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  label="מייל"
                  {...register("email")}
                  error={isError(errors.email)}
                  className={`${errors.email ? "is-invalid" : ""}`}
                  helperText={errors.email?.message}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
              אפס סיסמה
            </Button>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Link href="/signin" variant="body2">
                  {/* Already have an account? login */}
                  התחבר כאן
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
