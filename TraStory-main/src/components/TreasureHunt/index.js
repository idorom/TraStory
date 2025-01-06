import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import "./style-TreasureHunt.css";
import IconButton from "@mui/material/IconButton";
import { HeroBg, ImageBg } from "./TreasureHuntElement";
import Alert from "@material-ui/lab/Alert";
import QRreader from "../QRreader";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import StaticMap from "../StaticMap";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import imageDef from "../../images/tree.jpeg";
import { Box } from "@material-ui/core";

let sizePage = 0;
let GlobalFontReduce = 8;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(sizePage / 10 + 20),
    display: "flex",
    minHeight: "53vh",
    flexDirection: "column",
    alignItems: "center",
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
  },
  TheButton: {
    background: "#ffcc00",
    borderRadius: "30px",
    whiteSpace: "nowrap",
    fontSize: `${40 - GlobalFontReduce}px`,
    outline: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 38px",
    fontFamily: "lucida grande",
    fontSize: `${28 - GlobalFontReduce}px}`,
    transition: "all 0.2s ease-in-out",
  },
  bTStyled: {
    color: "#4d2800",
    fontFamily: "lucida grande",
  },
  hTStyled: {
    fontFamily: "lucida grande",
    fontStyle: "italic",
    fontWeight: "bold",
  },
}));

function TreasureHunt(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleback = () => {
    history.push("/");
  };
  const classes = useStyles();
  const history = useHistory();
  const [score, setScore] = useState(props.score);
  const [qNum, setQNum] = useState(props.qNum);
  const [prevAnswer, setPrevAnswer] = useState(props.prevAnswer);
  const [parameters, setParameters] = useState({ score: score, qNum: qNum - 1, flag: true, prevAnswer: props.prevAnswer, treasureHuntID: props.treasureHuntID });
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log("tttt", score <= Math.round(data?.gameList.length / 3) && !score > Math.round((data?.gameList.length * 2) / 3));

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  let data = props.treasureHunt;
  let totalQuestions;
  let userObs = props.userObs;
  let user = userObs.userInfo;

  function returnMyScoreNotice(score) {
    if (score <= Math.round(data?.gameList.length / 3) && score < Math.round((data?.gameList.length * 2) / 3)) return "😿 לא נורא";
    else if (score >= Math.round((data?.gameList.length * 2) / 3) && score < Math.round(data?.gameList.length)) return "🏆 כל הכבוד";
    else if (score === Math.round(data?.gameList.length)) return "ואו!!! מעולה 👑";
    else return null;
  }

  const [finalScore, setFinalScore] = useState(
    returnMyScoreNotice(score) ? (
      <Box item sx={{ bgcolor: returnMyScoreNotice(score) === "😿 לא נורא" ? "#9e9e9e" : "success.main", borderRadius: "3px" }}>
        <Typography className={classes.bTStyled} component="h6" variant="h6" style={{ fontSize: `${29 - GlobalFontReduce}px` }}>
          {returnMyScoreNotice(score)}
        </Typography>
      </Box>
    ) : null
  );

  useEffect(() => {
    data = props.treasureHunt;
    if (data !== undefined && !data) {
      setQNum(qNum > 0 || qNum < data?.gameList.length ? qNum : 0);
      totalQuestions = data.gameList.length;
      setParameters({ score: score, qNum: qNum - 1, flag: true, prevAnswer: props.prevAnswer, treasureHuntID: props.treasureHuntID });
    } else return;
  }, [props.treasureHunt]);

  useEffect(() => {
    sizePage = data?.gameList[qNum]?.nextclue.length ? data?.gameList[qNum]?.nextclue.length / 45 : 0;
    user = props?.userObs?.userInfo;
    if (user?.playedGames?.[`${props.treasureHuntID}`] !== undefined && user?.playedGames?.[`${props.treasureHuntID}`]) {
      setScore(props.score);
      setQNum(props.qNum);
      setPrevAnswer(props.prevAnswer);
      setParameters({ score: score, qNum: qNum - 1, flag: true, prevAnswer: props.prevAnswer, treasureHuntID: props.treasureHuntID });
      setBoolStartGame(false);
    }

    if (props.isJustAnswerd) {
      if (parameters?.qNum >= 0) {
        if (user && data) {
          userObs.updateUserGameProgress(user, parameters, data, totalQuestions, boolStartGame);
        }
      }
    }
  }, [props.userObs.userInfo, props.treasureHuntID]);

  const [boolStartGame, setBoolStartGame] = useState(props.boolStartGame);

  let answerResultFeedback = prevAnswer ? (
    <>
      <Alert severity="success">תשובתך נכונה</Alert>
    </>
  ) : (
    <>
      <Alert severity="error">תשובתך שגויה</Alert>
    </>
  );
  let startGameDisplay = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <br />
          <button
            type="button"
            className="fancy-btn"
            style={{ background: "#3B2A1A", color: "#fff", borderRadius: "50px", padding: "14px 40px" }}
            onClick={() => {
              if (user && data) {
                userObs.setUserGameProgress(user, data, totalQuestions, boolStartGame, props.treasureHuntID);
              }
              setBoolStartGame(false);
              history.push({
                pathname: `/treasureHunt/${props.treasureHuntID}`,
                state: { score: 0, qNum: 1, flag: true, boolStartGame: false },
              });
            }}
          >
            התחל משחק
          </button>
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      {data !== undefined ? (
        <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
          <HeroBg size={sizePage}>
            <ImageBg size={sizePage} img={data.imageURL ? data.imageURL : imageDef} />
          </HeroBg>
          {/* Move to Point ofIntrest page */}
          {data && data?.gameList[qNum - 1]?.pointIntrest && (
            <>
              <Button
                type="button"
                size="small"
                variant="outlined"
                style={{ justifyContent: "left", alignItems: "left", marginTop: "15px", color: "#4d2800", borderRadius: "50px", maxWidth: "210px" }}
                onClick={() => {
                  let arrayPath = data?.gameList[qNum - 1]?.pointIntrest?.barcode.split("/");
                  let sizeUrl = arrayPath.length;
                  history.push({
                    pathname: `/intrestPointInfoPage/${arrayPath[sizeUrl - 2]}/${arrayPath[sizeUrl - 1]}`,
                    state: { treasureHuntID: props.treasureHuntID },
                  });
                }}
              >
                מידע על התחנה {data?.gameList[qNum - 1]?.pointIntrest?.placeName}
              </Button>
              <br />
              <br />
            </>
          )}
          <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" minHeight="300px" minWidth="300px">
            <DialogTitle id="scroll-dialog-title" dir="rtl">
              מפת האתר
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef}>
                {data?.gameList && <StaticMap gameList={data?.gameList} pointIntrest={data?.gameList[qNum]?.pointIntrest} />}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>חזרה</Button>
            </DialogActions>
          </Dialog>
          <Grid item xs={12}>
            <Typography className={classes.hTStyled} component="h3" variant="h3" style={{ color: "#663300", alignItems: "center", fontSize: `${40 - GlobalFontReduce}px` }}>
              חפש את המטמון:
            </Typography>
            <Typography
              className={classes.hTStyled}
              component="h3"
              variant="h3"
              style={{ color: "#b35900", alignItems: "center", marginTop: "20px", fontSize: `${35 - GlobalFontReduce}px` }}
            >
              {data?.quizName}
            </Typography>
            {qNum === 0 && boolStartGame ? (
              <>
                <Typography className={classes.bTStyled} component="h6" variant="h6" style={{ fontSize: `${29 - GlobalFontReduce}px`, textDecoration: "underline" }}>
                  {"נכתב ע״י: " + data?.authorName}
                </Typography>
                <Typography className={classes.bTStyled} component="h5" variant="h5" style={{ fontSize: `${25 - GlobalFontReduce}px` }}>
                  {data?.description}
                </Typography>
              </>
            ) : null}
          </Grid>
          <CssBaseline />
          <div className={classes.paper}>
            {qNum === 0 && boolStartGame ? (
              startGameDisplay
            ) : (
              <Grid container spacing={2} alignContent="center" alignitem="center" justifyContent="center">
                <Grid item xs={12}>
                  <label className={classes.bTStyled} style={{ fontSize: `${28 - GlobalFontReduce}px` }}>
                    {"מספר התחנות שעברת הוא: " + props.treasureHunt?.gameList.length + " / " + qNum}
                  </label>
                  <br />
                  <label className={classes.bTStyled} style={{ fontSize: `${25 - GlobalFontReduce}px` }}>
                    {"הניקוד שלך: " + score}
                  </label>
                  {qNum === 0 ? null : answerResultFeedback}
                </Grid>
                <Grid item xs={12}>
                  <div>
                    {qNum < data?.gameList.length ? (
                      <>
                        <p className={classes.bTStyled} style={{ fontSize: `${30 - GlobalFontReduce}px`, textDecoration: "underline" }}>
                          הרמז לתחנה הבאה:
                          <IconButton onClick={handleClickOpen("body")}>
                            <NotListedLocationIcon style={{ width: "45px", height: "45px" }} />
                          </IconButton>
                        </p>
                        <p className={classes.bTStyled} style={{ fontSize: `${25 - GlobalFontReduce}px` }}>
                          {data?.gameList[qNum].nextclue}
                        </p>
                      </>
                    ) : null}
                  </div>
                </Grid>
                {data && qNum < data?.gameList.length ? (
                  <>
                    <Grid item xs={12}>
                      <h5 className={classes.bTStyled} style={{ fontSize: `${28 - GlobalFontReduce}px` }}>
                        סרוק את התחנה הבאה:
                      </h5>
                    </Grid>
                    <Grid item xs={8}>
                      <QRreader
                        infoInizialize={data?.gameList[qNum].qrURL}
                        totalQuestions={data?.gameList.length}
                        isURL={true}
                        parameters={parameters}
                        isInGameMode={true}
                        dataQuestions={data?.gameList[qNum]}
                      />
                    </Grid>
                  </>
                ) : null}
                {
                  //after finish the game- reset- going to drop down later
                  data && qNum < data?.gameList.length ? null : (
                    <>
                      <Grid item xs={6} style={{ justifyContent: "center" }}>
                        {finalScore}
                      </Grid>
                      <Grid item xs={7}></Grid>
                      <button
                        type="button"
                        className="fancy-btn"
                        style={{ background: "#3B2A1A", color: "#fff", borderRadius: "50px", padding: "14px 40px", marginTop: "5px" }}
                        onClick={() => {
                          history.push(`/treasureHuntSearch`);
                        }}
                      >
                        חזרה למשחקים
                      </button>
                    </>
                  )
                }
              </Grid>
            )}
          </div>
        </Container>
      ) : null}
    </>
  );
}
export default TreasureHunt;
