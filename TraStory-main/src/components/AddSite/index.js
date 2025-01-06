import { HeroBg, VideoBg } from "./AddSiteElements";
import background from "../../images/treasureBack.png";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase, { storage } from "../../Firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import AvatarQuiz, { getURL } from "../AvatarQuiz";
import CircularProgress from "@mui/material/CircularProgress";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(25),
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

export default function AddSite() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    siteDescription: Yup.string().required("שדה זה הוא שדה חובה"),
    siteName: Yup.string().required("שדה זה הוא שדה חובה"),
    lat: Yup.number().typeError("שדה זה הוא חובה וחייב להיות מספר"),
    long: Yup.number().typeError("שדה זה הוא חובה וחייב להיות מספר"),
  });

  const [latValue, setLatValue] = useState();
  const [longValue, setLongValue] = useState();
  const handleChangeLat = (latValue) => (event) => {
    setLatValue(event.target.value);
  };
  const handleChangeLong = (longValue) => (event) => {
    setLongValue(event.target.value);
  };

  const formOptions = { resolver: yupResolver(validationSchema), defaultValues: {} };
  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(formOptions);

  //Add a site to DB
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    let image1 = getURL();

    try {
      firebase
        .firestore()
        .collection("Sites")
        .add({
          description: data.siteDescription,
          siteName: data.siteName,
          geoLocation: new firebase.firestore.GeoPoint(data.lat, data.long),
        })
        .then((doc) => {
          if (doc.id === null) return;
          let uid = doc.id;
          if (image1) {
            //add image to field to a site
            imageHandler(image1, uid).then(() => {});
          } else {
            setLoading(false);
            setSiteNameValue("");
            setSiteDescriptionValue("");
            setLongValue("");
            setLatValue("");
            setSuccess("האתר הוסף בהצלחה");
            history.push("/addSite");
          }
        });
    } catch (e) {
      setError("הוספת האתר נכשלה");
      setLoading(false);
      history.push("/addSite");
      return null;
    }
  };

  //Handle adding an image that goes to DB
  async function imageHandler(image1, id) {
    if (image1) {
      // add to image folder in firebase
      const uploadTask = storage.ref(`siteImages/Sites/${id}/${image1.name}`).put(image1);
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
                .collection("Sites")
                .doc(id)
                .update({ sitePhoto: downloadURL })
                .then(() => {
                  setSuccess("האתר הוסף בהצלחה");
                  setLoading(false);
                  setSiteNameValue("");
                  setSiteDescriptionValue("");
                  setLongValue("");
                  setLatValue("");
                  setAvatarImage();
                  history.push("/addSite");
                });
            } catch (e) {
              setError("הוספת תמונה לאתר נכשלה");
              setLoading(false);
              history.push("/addSite");
            }
          });
        }
      );
    }
  }

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [siteNameValue, setSiteNameValue] = useState("");
  const [siteDescriptionValue, setSiteDescriptionValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarImage, setAvatarImage] = useState();
  const handleImageChange = (imageFile) => {
    setAvatarImage(imageFile);
  };

  //******Handle Changes in all fields******//
  const handleChangesite = (siteDescriptionValue) => (event) => {
    setSiteDescriptionValue(event.target.value);
  };
  const handleChangesiteName = (siteValue) => (event) => {
    setSiteNameValue(event.target.value);
  };
  //************************************//

  //Helper method- help TextField's attribute to change color for indication
  function isError(error) {
    if (error) return true;
    else return false;
  }

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg>
          <VideoBg src={background} />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TravelExploreIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            הוספת אתר
          </Typography>
          <AvatarQuiz handleChangeImage={handleImageChange} avatarImage={avatarImage} isEdiable={false} />
          {loading && <CircularProgress sx={{ display: "flex", justifyContent: "center", color: "#3B2A1A" }} />}
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
                <TextField
                  name="siteName"
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="שם האתר*"
                  {...register("siteName")}
                  className={`${errors.siteName ? "is-invalid" : ""}`}
                  value={siteNameValue}
                  onChange={handleChangesiteName("siteNameValue")}
                  error={isError(errors.siteName)}
                  helperText={errors.siteName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="siteDescription"
                  variant="outlined"
                  multiline
                  rows={8}
                  fullWidth
                  type="text"
                  label="תיאור האתר*"
                  {...register("siteDescription")}
                  className={`${errors.siteDescription ? "is-invalid" : ""}`}
                  value={siteDescriptionValue}
                  onChange={handleChangesite("siteDescriptionValue")}
                  error={isError(errors.siteDescription)}
                  helperText={errors.siteDescription?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lat"
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="נקודת אורך*"
                  {...register("lat")}
                  className={`${errors.lat ? "is-invalid" : ""}`}
                  value={latValue}
                  onChange={handleChangeLat("latValue")}
                  error={isError(errors.lat)}
                  helperText={errors.lat?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="long"
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="נקודת רוחב*"
                  {...register("long")}
                  className={`${errors.long ? "is-invalid" : ""}`}
                  value={longValue}
                  onChange={handleChangeLong("longValue")}
                  error={isError(errors.long)}
                  helperText={errors.long?.message}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
              שלח
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
}
