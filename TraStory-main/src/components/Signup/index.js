import { HeroBg, VideoBg } from "./SignupElements";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import React, { useState } from "react";
import { useAuth } from "../../Contexts/AuthContexts";
import { useHistory } from "react-router-dom";
import firebase, { storage } from "../../Firebase";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import AvatarPicker, { getURL } from "../AvatarPicker";
import TextFieldForm from "./TextFieldForm";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(29),
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

let imgUplodPath = "";

export default function Signup(props) {
  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("שם פרטי הוא שדה חובה"),
    lastName: Yup.string().required("שם משפחה הוא שדה חובה"),
    email: Yup.string().required("מייל הוא שדה חובה").email("מייל לא תקין"),
    password: Yup.string()
      .matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, "סיסמה חייבת להכיל 6 תווים, אות גדולה, אות קטנה ומספר")
      .required("סיסמה הוא שדה חובה"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "אימות סיסמה אינו תואם")
      .required("אימות סיסמה הוא שדה חובה"),
  });

  const isSignOrEdistor = props.isSignOrEdistor;
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      ProfieImgURL: "",
    },
  };
  let startUrl = null;

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  //Handle adding an image that goes to DB
  async function imageHandler(image1, uid) {
    if (image1) {
      // add to image folder in firebase
      const uploadTask = storage.ref(`images/${uid}/profilePic/${image1.name}`).put(image1);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
          return;
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error);
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            try {
              firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .update({ ProfieImgURL: downloadURL })
                .then(() => {
                  console.log("updated");
                  history.push("/");
                  setLoading(false);
                });
            } catch (e) {
              setError(e);
              history.push("/signup");
              setLoading(false);
            }
          });
        }
      );
    }
  }

  //Sign up new user AND Add a user to DB
  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (isAskedToBeCreator && infoProfileValue.length === 0) {
      setError("אם בחרת להיות יוצר תוכן, יש צורך בלפרט את המומחיות שלך");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    let image1 = getURL();
    //Add authorisation in Firebase AND Add a user to DB
    authAndFirstoreCollection(data.email, data.password, data.firstName, data.lastName, imgUplodPath).then((userid) => {
      if (userid === null) return;
      let uid = userid;
      if (image1) {
        //add profile image to field to an user
        imageHandler(image1, uid).then(() => {});
      } else {
        setLoading(false);
        history.push("/");
      }
    });
  };

  async function authAndFirstoreCollection(email1, password1, firstName1, lastName1, url1) {
    try {
      return await signup(email1, password1)
        .then((uid) => {
          let useruid = uid;
          firebase.firestore().collection("users").doc(uid).set({
            email: email1,
            firstName: firstName1,
            lastName: lastName1,
            ProfieImgURL: url1,
            infoProfileValue: infoProfileValue,
            isApproved: false,
            isAskedToBeCreator: isAskedToBeCreator,
            type: "registered",
          });
          return useruid;
        })
        .then((uid) => {
          return uid;
        });
    } catch (e) {
      setError("משתמש כבר קיים במערכת");
      setLoading(false);
      history.push("/signup");
      return null;
    }
  }

  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [error, setError] = useState("");

  const [avatarImage, setAvatarImage] = useState();
  const handleImageChange = (imageFile) => {
    setAvatarImage(imageFile);
  };

  const [isAskedToBeCreator, setisAskedToBeCreator] = useState(false);
  const [infoProfileValue, setInfoProfileValue] = useState("");

  const handleChangeinfoProfile = (infoProfileValue) => (event) => {
    setInfoProfileValue(event.target.value);
  };

  const handleChangeCheckBox = (name) => (event) => {
    setInfoProfileValue("");
    setisAskedToBeCreator(event.target.checked);
  };

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
            דף הרשמה
          </Typography>
          <AvatarPicker handleChangeImage={handleImageChange} avatarImage={avatarImage} isEdiable={false} startUrl={startUrl} />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              <TextFieldForm inputType="text" name="firstName" label="שם פרטי*" register={register} textError={errors.firstName} size={6} helperText={errors.firstName?.message} />
              <TextFieldForm inputType="text" name="lastName" label="שם משפחה*" register={register} textError={errors.lastName} size={6} helperText={errors.lastName?.message} />
              <TextFieldForm inputType="email" name="email" label="מייל*" register={register} textError={errors.email} size={12} helperText={errors.email?.message} />
              <TextFieldForm
                inputType="password"
                name="password"
                label="סיסמה*"
                register={register}
                textError={errors.password}
                size={12}
                helperText={errors.password?.message ?? "סיסמה חייבת להכיל 6 תווים, אות גדולה, אות קטנה ומספר"}
              />
              <TextFieldForm
                inputType="password"
                name="confirmPassword"
                label="אימות סיסמה*"
                register={register}
                textError={errors.confirmPassword}
                size={12}
                helperText={errors.confirmPassword?.message}
              />
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={isAskedToBeCreator} onChange={handleChangeCheckBox(isAskedToBeCreator)} value="isAskedToBeCreator" />}
                  label="מעוניינים להוסיף תוכן לאתר? רשמו לנו את מקור הידע/מומחיות שלכם, ומנהלי האתר יאשרו אתכם בהקדם
                    "
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="infoProfile"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
                  disabled={!isAskedToBeCreator}
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
              הירשם
            </Button>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Link href="/signin" variant="body2">
                  כבר יש לך חשבון? התחבר כאן
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
