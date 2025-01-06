import { HeroBg, VideoBg } from "./SignInElemments";
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
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useAuth } from "../../Contexts/AuthContexts";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function SignIn(props) {
  // designing the main container//
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(0),
      minHeight: props?.inSignInPage ? "86vh" : "0",
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
      zIndex: 99,
      opacity: props?.inSignInPage ? 0.99999 : null,
      background: !props?.inSignInPage ? "white" : null,
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

  const errorRequiredField = " הוא שדה חובה";
  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("מייל" + errorRequiredField)
      .email("מיי לא תקין"),
    password: Yup.string()
      // כמו בדף ההרשמה, כיוון שמשתמש צריך לדעת בדף זה את הסיסמה שלו, אלא רק שהסיסמה לא תיהיה ריקה'.matches' אין צורך בבבדיקת
      .required("סיסמה" + errorRequiredField),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const { login, getUserDate } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  //sign in user
  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      //login uer and give authorisation
      await login(data.email, data.password).then(() => {
        new Promise((resolve) => setTimeout(resolve, 800)).then(() => {
          setLoading(false);
          props?.inSignInPage ? history.goBack() : history.push("/");
        });
      });
    } catch (e) {
      console.log("error", e.message);
      setError("משתמש אינו קיים או שהסיסמה אינה נכונה");
      history.push(props?.inSignInPage ? "/signin" : "/"); //"/signin"
      setLoading(false);
      return;
    }
  };

  function isError(error) {
    if (error) return true;
    else return false;
  }

  console.log("refresh-signin");
  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        {props?.inSignInPage && (
          <HeroBg>
            <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
          </HeroBg>
        )}
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" align="center">
            התחברות
          </Typography>
          <div className={classes.unaffected}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
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
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    label="סיסמה"
                    {...register("password")}
                    error={isError(errors.password)}
                    className={`${errors.password ? "is-invalid" : ""}`}
                    helperText={errors.password?.message}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
                התחבר
              </Button>
              <Grid container justifyContent="flex-start">
                <Grid item>
                  <Link href="/signup" variant="body2">
                    אין לך חשבון? הירשם כאן
                  </Link>
                  <br />
                  <Link href="/ForgotPassword" variant="body2">
                    אם שכחת סיסמה? אפס סיסמה כאן
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
