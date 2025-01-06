import { HeroBg, VideoBg } from "./TresurHuntTamplateElemments";
import Video from "../../videos/video.mp4";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React from "react";
import Quiz from "./Quiz";

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: "58vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "rgb(0,0,0)",
    "& .MuiInputLabel-root": {
      color: "black",
    },
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
    width: "100%",
  },
}));

export default function TresurHuntTamplate(props) {
  const classes = useStyles();
  let qNum = props.myqNum;
  let score = props.myScore;
  let isOnlyQuiz = props.isOnlyQuiz;
  let dataQuestions = props.dataQuestions;
  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="md" dir="rtl">
        <HeroBg>
          <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          <br />
          <Grid container justifyContent="flex-start" spacing={2}>
            <Quiz myqNum={qNum} myScore={score} isOnlyQuiz={isOnlyQuiz} thID={props.thID} dataQuestions={dataQuestions} totalQuestions={props.totalQuestions} />
          </Grid>
        </div>
      </Container>
    </>
  );
}
