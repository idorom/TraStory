import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import DynamicList from "./DynamicList";

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

let imgUplodPath = "";
let choosenObs;

export default function EditProfile(props) {
  const classes = useStyles();
  const [subject, setSubject] = useState();
  const [games, setGames] = useState([]);
  const storiesObs = props.store.storiesObs;
  const clueObs = props.store.clueObs;
  const user = props.user;
  const questionObs = props.store.questionObs;
  const gamesObs = props.store.treasureHuntObs;
  const [infoProfileValue, setInfoProfileValue] = useState();
  const optionList = ["סיפורים", "רמזים", "שאלות", "משחקים"];
  const [gameList, setGameList] = useState([]);
  const [stories, setStories] = useState([]);
  const [clues, setClues] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const handleChangeinfoProfile = (infoProfileValue) => (event) => {
    setInfoProfileValue(event.target.value);
  };

  const getSubject = (value) => {
    setSubject(value);
    toDataBase(value);
  };

  function toDataBase(subject) {
    if (subject === "סיפורים") {
      let temp = [];
      let userStories = [];
      storiesObs.initStories().then(() => {
        temp = storiesObs.storiesList;
        for (let story in temp) {
          if (temp[story].authorName === user.firstName + " " + user.lastName) {
            userStories.push(temp[story]);
          }
        }
        setStories(userStories);
        choosenObs = storiesObs;
        setGameList(userStories);
      });
    } else if (subject === "רמזים") {
      let temp = [];
      let userClues = [];
      clueObs.initAllClues().then(() => {
        temp = clueObs.cluesList;
        for (let clue in temp) {
          if (temp[clue]?.creator === user.firstName + " " + user.lastName) {
            userClues.push(temp[clue]);
          }
        }
        setClues(userClues);
        choosenObs = clueObs;
        setGameList(userClues);
      });
    } else if (subject === "שאלות") {
      let temp = [];
      let userQuestions = [];
      questionObs.initAllQuestions().then(() => {
        temp = questionObs.questionsList;
        for (let question in temp) {
          if (temp[question]?.creator === user.firstName + " " + user.lastName) {
            userQuestions.push(temp[question]);
          }
        }
        setQuestions(userQuestions);
        choosenObs = questionObs;
        setGameList(userQuestions);
      });
    } else if (subject === "משחקים") {
      let temp = [];
      let userGames = [];
      gamesObs.initTreasureHunt().then(() => {
        temp = gamesObs.treasureHuntList;
        for (let game in temp) {
          if (temp[game]?.authorName === user.firstName + " " + user.lastName) {
            userGames.push(temp[game]);
          }
        }
        setGames(userGames);
        choosenObs = gamesObs;
        setGameList(userGames);
      });
    } else {
      return;
    }
  }

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <CssBaseline />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={optionList}
          sx={{ width: 300 }}
          onChange={(event, value) => getSubject(value)}
          renderInput={(params) => <TextField {...params} label="נושאים" />}
        />
        <div className="scroll">{gameList && <DynamicList itemsList={gameList} choosenObs={choosenObs} />}</div>
      </Container>
    </>
  );
}
