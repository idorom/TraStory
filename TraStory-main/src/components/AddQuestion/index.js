import { HeroBg, ImageBg } from "./AddQuestionElements";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
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

export default function AddQuestion({ store, user }) {
  //form schema
  const validationSchema = Yup.object().shape({
    question: Yup.string().required("שדה שאלה הוא שדה חובה"),
    answer1: Yup.string().required("שדה תשובה הוא שדה חובה"),
    answer2: Yup.string().required("שדה תשובה הוא שדה חובה"),
    answer3: Yup.string().required("שדה תשובה הוא שדה חובה"),
    answer4: Yup.string().required("שדה תשובה הוא שדה חובה"),
  });

  const formOptions = { resolver: yupResolver(validationSchema), defaultValues: {} };
  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  //Add a question to DB
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    let answers = [data.answer1, data.answer2, data.answer3, data.answer4];
    let correctAnswerInArray = 0;
    let temp = { answers: answers, correctAnswer: correctAnswerInArray };
    shuffle(temp);
    try {
      firebase
        .firestore()
        .collection("Sites")
        .doc(selectedLocation.id)
        .collection("subSites")
        .doc(selectedPoint.id)
        .collection("questions")
        .add({
          question: data.question,
          answers: answers,
          correctAnswer: temp.correctAnswer + 1,
          locationName: selectedLocation.siteName,
          pointName: selectedPoint.placeName,
          creator: user.firstName + " " + user.lastName,
          isApproved: false,
        })
        .then(() => {
          reset({
            question: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
          });
          setSelectedLocation("");
          setSelectedPoint("");
          setSubSites([]);
          setLoading(false);
          setSuccess("השאלה הוספה בהצלחה");
          history.push("/addQuestion");
        });
    } catch (e) {
      // setError(e);
      setLoading(false);
      history.push("/addQuestion");
      return null;
    }
  };

  function shuffle(temp) {
    let array = temp.answers;
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

      //follow the correct answer
      if (temp.correctAnswer === currentIndex) temp.correctAnswer = randomIndex;
      if (temp.correctAnswer === randomIndex) temp.correctAnswer = currentIndex;
    }
    return array;
  }

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //******Handle Changes in all fields******//
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedPoint, setSelectedPoint] = React.useState("");
  const [isPointSelected, setIsPointSelected] = React.useState(true);

  const [questionValue, setQuestionValue] = useState();
  const [answer1Value, setAnswer1Value] = useState();
  const [answer2Value, setAnswer2Value] = useState();
  const [answer3Value, setAnswer3Value] = useState();
  const [answer4Value, setAnswer4Value] = useState();

  const handleChangequestion = (questionValue) => (event) => {
    setQuestionValue(event.target.value);
  };
  const handleChangeanswer1Value = (answer1Value) => (event) => {
    setAnswer1Value(event.target.value);
  };
  const handleChangeanswer2Value = (answer2Value) => (event) => {
    setAnswer2Value(event.target.value);
  };
  const handleChangeanswer3Value = (answer3Value) => (event) => {
    setAnswer3Value(event.target.value);
  };
  const handleChangeanswer4Value = (answer4Value) => (event) => {
    setAnswer4Value(event.target.value);
  };
  const handleChangeLocation = (event) => {
    subSiteObs.initSubSites(event.target.value.id).then(() => {
      setSelectedLocation(event.target.value);
      if (sites.length > 0) setSubSites(subSiteObs.subSitesList);
      else setSubSites([]);
    });
  };
  const handleChangePoint = (event) => {
    setSelectedPoint(event.target.value);
    setIsPointSelected();
  };
  //************************************//

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            יצירת שאלה לנקודת עניין
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
                  name="question"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  type="text"
                  label="שאלה*"
                  {...register("question")}
                  className={`${errors.question ? "is-invalid" : ""}`}
                  onChange={handleChangequestion("questionValue")}
                  error={isError(errors.question)}
                  helperText={errors.question?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer1"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  type="text"
                  label="נכונה*"
                  {...register("answer1")}
                  className={`${errors.answer1 ? "is-invalid" : ""}`}
                  onChange={handleChangeanswer1Value("answer1Value")}
                  error={isError(errors.answer1)}
                  helperText={errors.answer1?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer2"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  type="text"
                  label="מסיח 1*"
                  {...register("answer2")}
                  className={`${errors.answer2 ? "is-invalid" : ""}`}
                  onChange={handleChangeanswer2Value("answer2Value")}
                  error={isError(errors.answer2)}
                  helperText={errors.answer2?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer3"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  type="text"
                  label="מסיח 2*"
                  {...register("answer3")}
                  className={`${errors.answer3 ? "is-invalid" : ""}`}
                  onChange={handleChangeanswer3Value("answer3Value")}
                  error={isError(isError(errors.answer3))}
                  helperText={errors.answer3?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer4"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  type="text"
                  label="מסיח 3*"
                  {...register("answer4")}
                  className={`${errors.answer4 ? "is-invalid" : ""}`}
                  onChange={handleChangeanswer4Value("answer4Value")}
                  error={isError(errors.answer4)}
                  helperText={errors.answer4?.message}
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
