import React, { useState, useEffect } from "react";
import AvatarQuiz, { getURL } from "../AvatarQuiz";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import background from "../../images/treasureBack.png";
import { makeStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import MenuItem from "@mui/material/MenuItem";
import DynamicList from "./DynamicList";
import Container from "@material-ui/core/Container";
import firebase, { storage } from "../../Firebase";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const schema = Yup.object().shape({
  quizName: Yup.string().required("שדה זה הוא שדה חובה"),
  description: Yup.string().min(8).required("שדה זה הוא שדה חובה"),
});

const CreateGame = ({ store, user }) => {
  const [sites, setSites] = useState([]);
  const [subSites, setSubSites] = useState([]);
  const [clues, setClues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [totalSize, setTotalSize] = useState();
  const siteObs = store.siteObs;
  const subSiteObs = store.subSiteObs;
  const clueObs = store.clueObs;
  const questionObs = store.questionObs;

  //******Handle Changes in all fields******//
  useEffect(() => {
    setSites([]);
    siteObs.initSites().then(() => {
      setSites(siteObs.SitesList);
    });
  }, []);

  // designing the main container//
  const useStyles = makeStyles((theme) => ({
    root: {
      whiteSpace: "unset",
      wordBreak: "break-all",
      justifyContent: "flex-end",
    },
    Container: {
      opacity: 0.99999,
      zIndex: 5,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: `${100 * totalSize}%`,
      minHeight: `100vh`,
      backgroundImage: `url(${background})`,
      marginBottom: { totalSize } + 30,
      "& .MuiInputLabel-root": {
        color: "black",
      },
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    setTotalSize(gameList.length ? gameList.length + 30 : 1);
  }, [gameList]);

  const [avatarImage, setAvatarImage] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleImageChange = (imageFile) => {
    setAvatarImage(imageFile);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  //Add a treasure Hunt game to DB
  const onSubmitHandler = (data) => {
    if (loading === true) return;
    setLoading(true);
    setError("");
    setSuccess("");
    let image1 = getURL();
    console.log({
      description: data.description,
      treasureHuntLikesNum: 0,
      quizName: data.quizName,
      authorName: user.firstName + " " + user.lastName,
      gameList: gameList,
      isApproved: false,
    });
    try {
      firebase
        .firestore()
        .collection("TreasureHunt")
        .add({
          description: data.description,
          treasureHuntLikesNum: 0,
          siteName: selectedLocation.siteName,
          quizName: data.quizName,
          authorName: user.firstName + " " + user.lastName,
          gameList: gameList,
          isApproved: false,
          imageURL: selectedLocation.sitePhoto ? selectedLocation.sitePhoto : null,
        })
        .then((doc) => {
          if (doc.id === null) return;
          let uid = doc.id;
          if (image1) {
            //add image to field to a Treasure Hunt game
            imageHandler(image1, uid).then(() => {});
          } else {
            reset();
            setGameList([]);
            setSuccess("משחק חפש את המטמון הוסף בהצלחה");
            setSelectedQuestion();
            setSelectedClue();
            setClues([]);
            setQuestions([]);
            setSelectedLocation("");
            setSelectedPoint("");
            setSelectDisabled(false);
            setLoading(false);
            setDisableFinish(null);
            history.push("/addQuiz");
          }
        });
    } catch (e) {
      console.log(e);
      setError(e.toString());
      history.push("/addQuiz");
      setLoading(false);
    }
  };

  //Handle adding an image that goes to DB
  async function imageHandler(image1, id) {
    if (image1) {
      // add to image folder in firebase
      const uploadTask = storage.ref(`TreasureHuntImages/${id}/${image1.name}`).put(image1);
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
                .collection("TreasureHunt")
                .doc(id)
                .update({ imageURL: downloadURL })
                .then(async () => {
                  reset();
                  setGameList([]);
                  setSuccess("משחק חפש את המטמון הוסף בהצלחה");
                  setSelectedQuestion();
                  setSelectedClue();
                  setClues([]);
                  setQuestions([]);
                  setSelectedLocation("");
                  setSelectedPoint("");
                  setAvatarImage();
                  setSelectDisabled(false);
                  setLoading(false);
                  setDisableFinish(null);
                  history.push("/addQuiz");
                });
            } catch (e) {
              setError("הוספת תמונה למשחק חפש את המטמון נכשלה");
              history.push("/addQuiz");
              setLoading(false);
            }
          });
        }
      );
    }
  }

  //Helper method- help TextField's attribute to change color for indication
  function isError(error) {
    if (error) return true;
    else return false;
  }

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [gameList, setGameList] = useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(" ");
  const [selectedPoint, setSelectedPoint] = React.useState(" ");
  const [selectedClue, setSelectedClue] = React.useState();
  const [selectedQuestion, setSelectedQuestion] = React.useState();
  const [isLocationSelected, setIsLocationSelected] = React.useState(true);
  const [isPointSelected, setIsPointSelected] = React.useState(true);

  //******Handle Changes in all fields******//
  const handleChangeLocation = (event) => {
    setSelectedLocation(event.target.value);
    setIsLocationSelected();
    subSiteObs.initSubSites(event.target.value.id).then(() => {
      setSubSites(subSiteObs.subSitesList);
    });
  };
  const handleChangePoint = (event) => {
    setSelectedPoint(event.target.value);
    setIsPointSelected();
    clueObs.initClues(selectedLocation.id, event.target.value.id).then(() => {
      let arrClue = clueObs.cluesList.filter((item) => item.isApproved);
      setClues(arrClue);
    });
    questionObs.initQuestions(selectedLocation.id, event.target.value.id).then(() => {
      let arrQ = questionObs.questionsList.filter((item) => item.isApproved);
      setQuestions(arrQ);
    });
  };
  const handleChangeClue = (event) => {
    setSelectedClue(event.target.value);
    console.log("clue:", selectedClue);
  };
  const handleChangeQuestion = (event) => {
    setSelectedQuestion(event.target.value);
  };
  //************************************//

  const [disableFinish, setDisableFinish] = useState(null);

  //Set the button of submit if in the game has at least 3 stations. //
  //canSave() is Also an attribute on dynamiclist and called from there//
  function canSave(arg) {
    //Set the button of submit if in the game has at least 3 stations.
    //Because on React the state has delay of changing on "one operation" we handle add or remove station by a condition.
    if (gameList.length >= (arg === "a" ? 2 : 3)) {
      setDisableFinish(
        <Button type="submit" color="primary" variant="Light" disabled={loading}>
          סיום ⬅
        </Button>
      );
    } else {
      setDisableFinish(null);
    }
    //Decide if the gameList?.length is empty or not, if it empty the select can be selected again else it'll be disabled.
    //Because on React the state has delay of changing on "one operation" we handle add or remove station by a condition.
    setSelectDisabled(gameList?.length >= (arg === "a" ? 0 : 1) ? true : false);
  }

  //Add a station in the game
  const handleAdd = (event) => {
    setSelectDisabled(true);
    if (!selectedQuestion || !selectedClue) {
      if (!selectedQuestion && !selectedClue) {
        setError(" יש לבחור שאלה ורמז טרם הוספת תחנה");
      }
      if (!selectedQuestion && selectedClue) {
        setError("יש לבחור שאלה טרם הוספת תחנה");
      }
      if (!selectedClue && selectedQuestion) {
        setError("יש לבחור רמז טרם הוספת תחנה");
      }
      history.push("/addQuiz");
      return;
    }
    setError("");
    canSave("a");
    setGameList((gameList) => [
      ...gameList,
      {
        pointIntrest: selectedPoint,
        question: selectedQuestion.question,
        answers: selectedQuestion.answers,
        correct: selectedQuestion.correctAnswer,
        placeName: selectedQuestion.pointName,
        qrURL: selectedPoint.barcode,
        nextclue: selectedClue.clue,
      },
    ]);
    setSelectedQuestion();
    setSelectedClue();
    setClues([]);
    setQuestions([]);
    setSelectedLocation(selectedLocation);
    setSelectedPoint();
  };

  return (
    <Container className={classes.Container} component="main" maxWidth="xl" dir="rtl">
      <Button variant="info" style={{ backgroundColor: "#EF8D32", border: "#B05E27" }} onClick={handleShow}>
        ℹ הוראות
      </Button>
      <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#C68B59", border: "#B05E27" }} dir="rtl">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>הוראות להרכבת המשחק</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          1. בחרו שם למשחק והוסיפו תיאור קצר אודותיו (ניתן גם להוסיף תמונה )
          <br />
          2. בחרו את האתר בו תרצו שהמשחק יתנהל
          <br />
          3. בחרו את מסלול המשחק על ידי בחירת נקודות העניין, הרמזים והשאלות שיופיעו.
          <br />
          <br />
          <br />
          *שימו לב-
          <br />
          -סדר בחירת הנקודות יהיה סדר המשחק.
          <br />
          -יהיה ניתן להוסיף משחק בעל מינימום 3 מיקומים
          <br />
          <br />
          <h3> בהצלחה!</h3>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="row">
        <div className="col-sm">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
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
            <AvatarQuiz handleChangeImage={handleImageChange} avatarImage={avatarImage} isEdiable={false} />
            <TextField
              fullWidth
              type="quizName"
              {...register("quizName")}
              label="שם המשחק"
              className={`${errors.quizName ? "is-invalid" : ""}`}
              error={isError(errors.quizName)}
              helperText={errors.quizName?.message}
              variant="outlined"
              required
            />
            <br />
            <br />
            <TextField
              multiline
              rows={4}
              fullWidth
              type="text"
              variant="outlined"
              label="הוספת תיאור למשחק"
              className={`${errors.quizName ? "is-invalid" : ""}`}
              error={isError(errors.description)}
              helperText={errors.description?.message === "description must be at least 8 characters" ? "יש לרשום תיאור של לפחות 4 מילים" : errors.description?.message}
              {...register("description")}
              required
            />
            <br />
            <br />
            <TextField
              fullWidth
              id="outlined-select-location"
              select
              label="בחרו אתר*"
              value={selectedLocation}
              onChange={handleChangeLocation}
              variant="outlined"
              helperText="בחרו אתר למשחק "
              disabled={selectDisabled}
            >
              {sites &&
                sites.map((option) => (
                  <MenuItem key={option.id} value={option} style={{ justifyContent: "flex-end" }}>
                    {option.siteName}
                  </MenuItem>
                ))}
            </TextField>
            {disableFinish}
            <br />
            {loading && <CircularProgress sx={{ display: "flex", justifyContent: "center", color: "#3B2A1A" }} />}
          </form>
        </div>
        <div className="col-sm">
          <br />
          <br />
          <TextField
            fullWidth
            id="outlined-select-point"
            select
            required
            label="בחרו מיקום "
            value={selectedPoint}
            onChange={handleChangePoint}
            disabled={isLocationSelected}
            variant="outlined"
          >
            {subSites &&
              subSites.map((option) => (
                <MenuItem key={option.id} value={option} style={{ justifyContent: "flex-end" }}>
                  {option.placeName}
                </MenuItem>
              ))}
          </TextField>

          <br />
          <br />

          <TextField
            fullWidth
            id="outlined-select-clue"
            select
            label="בחרו רמז למיקום "
            value={selectedClue}
            onChange={handleChangeClue}
            disabled={isPointSelected}
            style={{ maxWidth: "35vw" }}
            multiline
            rows={5}
            variant="outlined"
          >
            {clues.map((option, i) => (
              <MenuItem key={option.id} value={option} style={{ justifyContent: "flex-end" }}>
                {option.clue}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <br />
          <TextField
            fullWidth
            id="outlined-select-question"
            select
            label="בחרו שאלה למיקום "
            value={selectedQuestion}
            onChange={handleChangeQuestion}
            disabled={isPointSelected}
            style={{ maxWidth: "35vw" }}
            multiline
            rows={5}
            variant="outlined"
          >
            {questions.map((option) => (
              <MenuItem key={option.id} value={option} style={{ justifyContent: "flex-end" }}>
                {option.question}
              </MenuItem>
            ))}
          </TextField>
          <br />

          <Button type="submit" onClick={handleAdd} variant="outlined" color="primary" className={classes.submit}>
            ➕ הוספה למשחק
          </Button>
          <Typography component="h6" variant="h6" style={{ fontSize: "12px" }}>
            יש לבחור לפחות 3 מיקומים על מנת שיהיה ניתן לשמור את המשחק
          </Typography>
        </div>

        <div className="col-sm">
          <br />
          <br />

          {gameList && (
            <DynamicList
              gameList={gameList}
              canSave={() => {
                canSave("d");
              }}
            />
          )}

          <br />
          <br />
        </div>
      </div>
    </Container>
  );
};

export default CreateGame;
