import { HeroBg, ImageBg } from "./AddClueElements";
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
import firebase from "../../Firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@material-ui/lab/Alert";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

let sizePage = 0;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(sizePage / 10 - 1),
    height: "86vh",
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

//Helper method- help TextField's attribute to change color for indication
function isError(error) {
  if (error) return true;
  else return false;
}

export default function AddClue({ store, user }) {
  //form schema
  const validationSchema = Yup.object().shape({
    clue: Yup.string().required("שדה שאלה הוא שדה חובה"),
  });

  const formOptions = { resolver: yupResolver(validationSchema), defaultValues: {} };
  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  //Add a clue to DB
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
        .doc(selectedPoint.id)
        .collection("clues")
        .add({
          clue: data.clue,
          locationName: selectedLocation.siteName,
          pointName: selectedPoint.placeName,
          creator: user.firstName + " " + user.lastName,
          isApproved: false,
        })
        .then(() => {
          setLoading(false);
          reset({
            clue: "",
          });
          setSelectedLocation();
          setSelectedPoint();
          setSubSites([]);
          setSites([]);
          siteObs.initSites().then(() => {
            setSites(siteObs.SitesList);
          });
          setSuccess("הרמז הוסף בהצלחה");
          history.push("/addClue");
        });
    } catch (e) {
      setError(e);
      setLoading(false);
      history.push("/addClue");
      return null;
    }
  };

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedLocation, setSelectedLocation] = React.useState();
  const [selectedPoint, setSelectedPoint] = React.useState();
  const [isPointSelected, setIsPointSelected] = React.useState(true);
  const [clueValue, setClueValue] = useState();
  const handleChangeclue = (clueValue) => (event) => {
    setClueValue(event.target.value);
  };

  //Handle Changes in Location field
  const handleChangeLocation = (event) => {
    subSiteObs.initSubSites(event.target.value.id).then(() => {
      setSelectedLocation(event.target.value);
      if (sites.length > 0) setSubSites(subSiteObs.subSitesList);
      else setSubSites([]);
    });
  };

  //Handle Changes in intrest point field
  const handleChangePoint = (event) => {
    setSelectedPoint(event.target.value);
    setIsPointSelected();
  };

  const [sites, setSites] = useState([]);
  const [subSites, setSubSites] = useState([]);
  const siteObs = store.siteObs;
  const subSiteObs = store.subSiteObs;

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
            יצירת רמז לנקודת עניין
          </Typography>
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
                  required
                  label="בחרו אתר"
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
                <TextField fullWidth id="outlined-select-point" select required label="בחרו מיקום" value={selectedPoint} onChange={handleChangePoint} variant="outlined">
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
                  name="clue"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  type="text"
                  label="רמז*"
                  {...register("clue")}
                  className={`${errors.clue ? "is-invalid" : ""}`}
                  onChange={handleChangeclue("clueValue")}
                  error={isError(errors.clue)}
                  helperText={errors.clue?.message}
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
