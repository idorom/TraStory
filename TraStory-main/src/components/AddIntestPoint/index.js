import { HeroBg, ImageBg } from "./AddIntrestPointElements";
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
import OtherDescriptions, { getTopicText, getTopicTextAlma } from "./otherDescriptions";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddIntrestPoint({ store }) {
  //form schema
  const validationSchema = Yup.object().shape({
    intrestPointName: Yup.string().required("שדה זה הוא שדה חובה"),
    description: Yup.string().required("שדה זה הוא שדה חובה"),
    lat: Yup.number().typeError("שדה זה הוא חובה וחייב להיות מספר"),
    long: Yup.number().typeError("שדה זה הוא חובה וחייב להיות מספר"),
  });

  //Helper method- help TextField's attribute to change color for indication
  function isError(error) {
    if (error) return true;
    else return false;
  }

  const formOptions = { resolver: yupResolver(validationSchema), defaultValues: {} };
  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  //Handle adding an image that goes to DB
  async function imageHandler(image1, id) {
    if (image1) {
      // add to image folder in firebase
      const uploadTask = storage.ref(`subSitesImages/SubSites/${id}/${image1.name}`).put(image1);

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
          //console.log("Upload is " + progress + "% done");
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              // console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              // console.log("Upload is running");
              break;
          }
          return;
        },
        function (error) {
          // Handle unsuccessful uploads
          // console.log(error);
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            try {
              firebase
                .firestore()
                .collection("Sites")
                .doc(selectedLocation.id)
                .collection("subSites")
                .doc(id)
                .update({ imageURL: downloadURL, barcode: `https://tracetory-4340e.firebaseapp.com/intrestPointInfoPage/${selectedLocation.id}/${id}` })
                .then(() => {
                  setIntrestPointNameValue("");
                  setSelectedLocation();
                  setSites([]);
                  siteObs.initSites().then(() => {
                    setSites(siteObs.SitesList);
                  });
                  setDescriptionValue("");
                  setLongValue("");
                  setLatValue("");
                  setAlmaList([]);
                  setOtherDescriptionsList([]);
                  setAvatarImage();
                  setSuccess(" הוסף בהצלחה");
                  history.push("/addIntrestPoint");
                  setLoading(false);
                });
            } catch (e) {
              setError("הוספה נכשלה");
              history.push("/addIntrestPoint");
              setLoading(false);
            }
          });
        }
      );
    }
  }

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const [totalSize, setTotalSize] = useState();

  // designing the main container//
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginBottom: theme.spacing(0),
      minHeight: "70vh",
      // height:`${totalSize}%` ,
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
      backgroundColor: "#412F1D",
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
  const classes = useStyles();

  // useEffect(async () => {
  //   setTotalSize(getTopicText()?.length ? getTopicText().length + 30 : 0);
  // }, [getTopicText()]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarImage, setAvatarImage] = useState();
  const handleImageChange = (imageFile) => {
    setAvatarImage(imageFile);
  };

  const [selectedLocation, setSelectedLocation] = useState();
  const [descriptionValue, setDescriptionValue] = useState();
  const [latValue, setLatValue] = useState();
  const [longValue, setLongValue] = useState();

  //******Handle Changes in all fields******//
  const handleChangeDescription = (descriptionValue) => (event) => {
    setDescriptionValue(event.target.value);
  };
  const handleChangeLat = (latValue) => (event) => {
    setLatValue(event.target.value);
  };
  const handleChangeLong = (longValue) => (event) => {
    setLongValue(event.target.value);
  };
  const [intrestPointNameValue, setIntrestPointNameValue] = useState();
  const handleChangeintrestPointName = (intrestPointValue) => (event) => {
    setIntrestPointNameValue(event.target.value);
  };
  const handleChangeLocation = (event) => {
    setSelectedLocation(event.target.value);
  };
  //************************************//

  const [sites, setSites] = useState([]);
  const siteObs = store.siteObs;
  //Helper varible for clear the "otherDescriptionsList" AND "almaList" after submit
  const [isSubmited, setIsSubmited] = useState(0);

  //intialize sites to the compoment from DB
  useEffect(() => {
    setSites([]);
    siteObs.initSites().then(() => {
      setSites(siteObs.SitesList);
    });
  }, []);

  const [otherDescriptionsList, setOtherDescriptionsList] = useState([]);
  const [almaList, setAlmaList] = useState([]);

  let image1 = getURL();

  //Add a intrest point to DB
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      firebase
        .firestore()
        .collection("Sites")
        .doc(selectedLocation.id)
        .collection("subSites")
        .add({
          placeName: data.intrestPointName,
          AlmaInfo: getTopicTextAlma(),
          barcode: "",
          mainDescription: [data.description],
          otherDescriptions: getTopicText(),
          siteName: selectedLocation.siteName,
          siteID: selectedLocation.id,
          geoPointSite: selectedLocation.geoLocation,
          geoPoint: new firebase.firestore.GeoPoint(data.lat, data.long),
        })
        .then((doc) => {
          if (doc.id === null) return;
          let uid = doc.id;
          if (image1) {
            //add image to field to an intrest point
            imageHandler(image1, uid).then(() => {});
          } else {
            firebase
              .firestore()
              .collection("Sites")
              .doc(selectedLocation.id)
              .collection("subSites")
              .doc(uid)
              .update({ barcode: `https://tracetory-4340e.firebaseapp.com/intrestPointInfoPage/${selectedLocation.id}/${uid}` })
              .then(() => {
                setIntrestPointNameValue("");
                setSelectedLocation();
                setSites([]);
                siteObs.initSites().then(() => {
                  setSites(siteObs.SitesList);
                });
                setDescriptionValue("");
                setLongValue("");
                setLatValue("");
                setIsSubmited(isSubmited + 1);
                setIsSubmited(isSubmited - 1);
                setAlmaList([]);
                setOtherDescriptionsList([]);
                setSuccess(" הוסף בהצלחה");
                history.push("/addIntrestPoint");
                setLoading(false);
              });
          }
        });
    } catch (e) {
      setLoading(false);
      console.log("the error", e);
      history.push("/addIntrestPoint");
      return null;
    }
  };

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg size={0}>
          <ImageBg size={0} />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TravelExploreIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            הוספת נקודת עניין
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
                  name="locationName"
                  id="outlined-select-location"
                  select
                  label="בחרו אתר"
                  value={selectedLocation}
                  onChange={handleChangeLocation}
                  variant="outlined"
                  helperText="בחרו אתר*"
                  error={isError(errors.selectedLocation)}
                  helperText={errors.selectedLocation?.message}
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
                <TextField
                  name="intrestPointName"
                  variant="outlined"
                  fullWidth
                  type="text"
                  label="שם נקודת העניין*"
                  {...register("intrestPointName")}
                  className={`${errors.intrestPointName ? "is-invalid" : ""}`}
                  value={intrestPointNameValue}
                  onChange={handleChangeintrestPointName("intrestPointNameValue")}
                  error={isError(errors.intrestPointName)}
                  helperText={errors.intrestPointName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  variant="outlined"
                  multiline
                  rows={8}
                  fullWidth
                  type="text"
                  label="תיאור כללי*"
                  {...register("description")}
                  className={`${errors.description ? "is-invalid" : ""}`}
                  value={descriptionValue}
                  onChange={handleChangeDescription("descriptionValue")}
                  error={isError(errors.description)}
                  helperText={errors.description?.message}
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
              <Grid container spacing={2}>
                <OtherDescriptions
                  register={register}
                  topic={"topic"}
                  text={"text"}
                  otherDescriptionsList={otherDescriptionsList}
                  almaList={almaList}
                  isSubmited={isSubmited}
                  errorTopic={errors.topic}
                  errorText={errors.text}
                  errors={errors}
                  helperTextTopic={errors.topic?.message}
                  helperTextText={errors.text?.message}
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
