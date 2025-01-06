import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../Firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(20),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "rgb(0,0,0)",
    "& .MuiInputLabel-root": {
      color: "black",
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
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

export default function EditProfile(props) {
  const validationSchema = Yup.object().shape({
    infoProfile: Yup.string().required(" זהו שדה חובה"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  let startUrl = null;
  if (props.user?.ProfieImgURL) startUrl = props.user.ProfieImgURL;

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user = props.user;
      await firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .update({
          infoProfileValue: infoProfileValue,
          isApproved: false,
          isAskedToBeCreator: true,
          type: "registered",
        })
        .then(async () => {
          setLoading(false);
          user.infoProfileValue = infoProfileValue;
          user.isApproved = false;
          user.isAskedToBeCreator = true;
          await props.userObs.setUser(user).then(() => {});
          setSuccess("הבקשה נשלחה בהצלחה");
          history.push("/activity");
        });
    } catch (e) {
      setError(" שגיאה");
      setLoading(false);
      history.push("/activity");
    }
  };

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [infoProfileValue, setInfoProfileValue] = useState();

  const handleChangeinfoProfile = (infoProfileValue) => (event) => {
    setInfoProfileValue(event.target.value);
  };

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">{success}</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography component="h6" variant="h6">
                  מעוניינים להוסיף תוכן לאתר? רשמו לנו את מקור הידע/מומחיות שלכם, ומנהלי האתר יאשרו אתכם בהקדם
                </Typography>
                <br />
                <TextField
                  name="infoProfile"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
                  type="text"
                  label="כתיבת מומחיות בקצרה"
                  {...register("infoProfile")}
                  className="is-invalid"
                  value={infoProfileValue}
                  onChange={handleChangeinfoProfile("infoProfileValue")}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
              שליחת בקשה
            </Button>
            <Grid container justifyContent="flex-start"></Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
