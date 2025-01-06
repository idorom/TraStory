import { HeroBg, ImageBg } from "./AddStoryElements";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase, { storage } from "../../Firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import AvatarQuiz, { getURL } from "../AvatarQuiz";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

let sizePage = 0;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(sizePage / 10 - 1),
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

//Helper method- help TextField's attribute to change color for indication
function isError(error) {
  if (error) return true;
  else return false;
}

export default function AddStory({ store, user }) {
  // form validation rules
  const validationSchema = Yup.object().shape({
    story: Yup.string().required("שדה סיפור הוא שדה חובה"),
    storyName: Yup.string().required("שדה שם סיפור הוא שדה חובה"),
  });
  const formOptions = { resolver: yupResolver(validationSchema), defaultValues: {} };
  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  //Add a story to DB
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    let image1 = getURL();
    try {
      firebase
        .firestore()
        .collection("Stories")
        .add({
          storyContent: data.story,
          storyName: data.storyName,
          storyLikesNum: 0,
          siteName: selectedLocation.siteName,
          placeName: selectedPoint.placeName,
          authorName: user.firstName + " " + user.lastName,
          isApproved: false,
          imageURL: selectedPoint.imageURL ? selectedPoint.imageURL : null,
        })
        .then((doc) => {
          if (doc.id === null) return;
          let uid = doc.id;
          if (image1) {
            //add image to field to a story
            imageHandler(image1, uid).then(() => {});
          } else {
            setLoading(false);
            reset({
              storyName: "",
              story: "",
            });
            setSelectedLocation("");
            setSelectedPoint("");
            setSubSites([]);
            setSuccess("הסיפור הוסף בהצלחה");
            history.push("/addStory");
          }
        });
    } catch (e) {
      setError("הוספת הסיפור נכשלה");
      setLoading(false);
      history.push("/addStory");
      return null;
    }
  };

  //Handle adding an image that goes to DB
  async function imageHandler(image1, id) {
    if (image1) {
      // add to image folder in firebase
      const uploadTask = storage.ref(`storiesImages/Stories/${id}/${image1.name}`).put(image1);
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
                .collection("Stories")
                .doc(id)
                .update({ imageURL: downloadURL })
                .then(async () => {
                  reset({
                    storyName: "",
                    story: "",
                  });
                  setSelectedLocation("");
                  setSelectedPoint("");
                  setSubSites([]);
                  setAvatarImage();
                  setSuccess("הסיפור הוסף בהצלחה");
                  history.push("/addStory");
                  setLoading(false);
                });
            } catch (e) {
              setError("הוספת תמונה לסיפור נכשלה");
              history.push("/addStory");
              setLoading(false);
            }
          });
        }
      );
    }
  }

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedLocation, setSelectedLocation] = React.useState(" ");
  const [selectedPoint, setSelectedPoint] = React.useState(" ");
  const [isPointSelected, setIsPointSelected] = React.useState(true);
  const [storyValue, setStoryValue] = useState();
  const [storyNameValue, setStoryNameValue] = useState();
  const [avatarImage, setAvatarImage] = useState();
  const [sites, setSites] = useState([]);
  const [subSites, setSubSites] = useState([]);
  const siteObs = store.siteObs;
  const subSiteObs = store.subSiteObs;

  //******Handle Changes in all fields******//
  const handleImageChange = (imageFile) => {
    setAvatarImage(imageFile);
  };
  const handleChangestory = (storyValue) => (event) => {
    setStoryValue(event.target.value);
  };
  const handleChangestoryName = (storyValue) => (event) => {
    setStoryNameValue(event.target.value);
  };
  const handleChangeLocation = (event) => {
    subSiteObs.initSubSites(event.target.value.id).then(() => {
      setSelectedLocation(event.target.value);
      // setIsLocationSelected()
      if (sites.length > 0) setSubSites(subSiteObs.subSitesList);
      else setSubSites([]);
    });
  };
  const handleChangePoint = (event) => {
    setSelectedPoint(event.target.value);
    setIsPointSelected();
  };
  //************************************//

  //intialize sites to the compoment from DB
  useEffect(() => {
    setSites([]);
    siteObs.initSites().then(() => {
      setSites(siteObs.SitesList);
    });
  }, []);

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg size={sizePage}>
          <ImageBg size={sizePage} />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TravelExploreIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            יצירת סיפור לנקודת עניין
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
                  fullWidth
                  id="outlined-select-location"
                  select
                  label="בחרו אתר*"
                  value={selectedLocation}
                  onChange={handleChangeLocation}
                  variant="outlined"
                  helperText="בחרו אתר למשחק "
                >
                  {sites &&
                    sites.map((option) => (
                      <MenuItem key={option.id} value={option} dir="rlt" style={{ justifyContent: "flex-end" }}>
                        {option.siteName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth id="outlined-select-point" select required label="בחרו מיקום*" value={selectedPoint} onChange={handleChangePoint} variant="outlined">
                  {subSites &&
                    subSites.map((option) => (
                      <MenuItem key={option.id} value={option} dir="rlt" style={{ justifyContent: "flex-end" }}>
                        {option.placeName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="storyName"
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="שם הסיפור*"
                  {...register("storyName")}
                  className={`${errors.storyName ? "is-invalid" : ""}`}
                  onChange={handleChangestoryName("storyNameValue")}
                  error={isError(errors.storyName)}
                  helperText={errors.storyName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="story"
                  variant="outlined"
                  multiline
                  rows={8}
                  fullWidth
                  type="text"
                  label="סיפור*"
                  {...register("story")}
                  className={`${errors.story ? "is-invalid" : ""}`}
                  onChange={handleChangestory("storyValue")}
                  error={isError(errors.story)}
                  helperText={errors.story?.message}
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
