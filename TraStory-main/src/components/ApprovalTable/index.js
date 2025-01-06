import React, { useState, useEffect } from "react";
import { Button, Checkbox, Table } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import background from "../../images/treasureBack.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Container from "@material-ui/core/Container";
import { HeroBg, ImageBg } from "./ApprovalTableElements";
import Avatar from "@material-ui/core/Avatar";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Typography from "@material-ui/core/Typography";

let sizePage = 0;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  root: {
    whiteSpace: "unset",
    wordBreak: "break-all",
  },
  paper: {
    marginBottom: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    color: "rgb(0,0,0)",
    "& .MuiInputLabel-root": {
      color: "black",
    },
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
    backgroundImage: `url(${background})`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3B2A1A",
  },
  "& .MuiSelect-select": {
    width: "160px",
    background: "white",
    opacity: "0.7",
    textAlign: "left",
    dir: "rtl",
    color: "black",
    fontSize: "1.15rem",
  },
  MuiSelect_select: {
    width: "160px",
    background: "white",
    opacity: "0.7",
    textAlign: "left",
    dir: "rtl",
    color: "black",
    fontSize: "1.15rem",
    zIndex: "50",
  },
  "& .MuiFormLabel-root": {
    color: "black",
    textAlign: "left",
    dir: "rtl",
    fontSize: "1.15rem",
  },
}));

let choosenObs;
const AprprovalTable = ({ store }) => {
  const [subject, setSubject] = useState();
  const [stories, setStories] = useState([]);
  const [treasureHunts, setTreasureHunts] = useState([]);
  const [clues, setClues] = useState([]);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sites, setSites] = useState([]);
  const [subSites, setSubSites] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [sitesNames, setSitesNames] = useState([]);
  const [topic, setTopic] = useState(" ");
  const storiesObs = store.storiesObs;
  const treasureHuntObs = store.treasureHuntObs;
  const clueObs = store.clueObs;
  const userObs = store.userObs;
  const questionObs = store.questionObs;
  const siteObs = store.siteObs;
  const subSiteObs = store.subSiteObs;
  const optionList = ["משתמשים", "רמזים", "שאלות", "סיפורים", "משחקי חפש את המטמון", "אתרים", "נקודות עניין"];
  const [selectedList, setSelectedList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openInfoStation, setOpenInfoStation] = useState(false);
  const [dialogInfo, setDialogInfo] = useState();
  const [stationInfo, setStationInfo] = useState();

  //**** handle the dialog panel for opening AND closing ****//
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickInfoStation = (placeName, clue, question) => {
    setStationInfo({ clue: clue, placeName: placeName, question: question });
    setOpenInfoStation(true);
  };
  const handleColseInfoStation = () => {
    setStationInfo();
    setOpenInfoStation(false);
    setDialogInfo();
  };
  //************************************************//

  //set a dialog text with data if subject="משחקי חפש את המטמון" for each station the user click on
  useEffect(() => {
    if (openInfoStation) {
      setDialogInfo(
        <Dialog
          style={{ textAlign: "right", direction: "rtl" }}
          open={openInfoStation}
          onClose={handleColseInfoStation}
          aria-labelledby="alert-dialog-title1"
          aria-describedby="alert-dialog-description1"
        >
          <DialogTitle id="alert-dialog-title1">מידע על התחנה: {stationInfo?.placeName} </DialogTitle>
          <DialogContent id="alert-dialog-description1">
            <DialogContentText style={{ fontWeight: "bold" }}>רמז לתחנה:</DialogContentText>
            <DialogContentText>{stationInfo?.clue}</DialogContentText>
            <DialogContentText style={{ fontWeight: "bold" }}>שאלה לתחנה:</DialogContentText>
            <DialogContentText>{stationInfo?.question}</DialogContentText>
          </DialogContent>
        </Dialog>
      );
    }
  }, [stationInfo]);

  //handle click of select for each row
  const handleSelectAllClick = (event, value) => {
    if (event.target.checked) {
      setSelectedList((selectedList) => [...selectedList, value]);
      return;
    } else if (!event.target.checked) {
      setSelectedList((selectedList) =>
        // Filter out the item with the matching index
        selectedList.filter((item) => item !== value)
      );
    }
  };

  //Defines selected subject and then get list of the data for the table
  const getSubject = (value) => {
    setTopic(value);
    setSubject(value);
    toDataBase(value);
    setSelectedList([]);
  };

  //Get from DB list of 'data' by the selected subject
  function toDataBase(subject) {
    if (subject === "סיפורים") {
      storiesObs.initStories().then(() => {
        setStories(storiesObs.storiesList);
        setSitesNames([]);
        let temp = [];
        storiesObs.storiesList.map((story) => temp.push(story.siteName));
        setSitesNames(temp);
        setSitesNames([...new Set(temp)]);
        choosenObs = storiesObs;
      });
    } else if (subject === "משחקי חפש את המטמון") {
      treasureHuntObs.initTreasureHunt().then(() => {
        setTreasureHunts(treasureHuntObs.treasureHuntList);
        setTableList(treasureHuntObs.treasureHuntList);
        setSitesNames([]);
        let temp = [];
        treasureHuntObs.treasureHuntList.map((treasureHunt) => temp.push(treasureHunt.siteName));
        setSitesNames(temp);
        setSitesNames([...new Set(temp)]);
        choosenObs = treasureHuntObs;
      });
    } else if (subject === "רמזים") {
      clueObs.initAllClues().then(() => {
        setClues(clueObs.cluesList);
        setTableList(clueObs.cluesList);
        setSitesNames([]);
        let temp = [];
        clueObs.cluesList.map((clue) => temp.push(clue.locationName));
        setSitesNames(temp);
        setSitesNames([...new Set(temp)]);
        choosenObs = clueObs;
      });
    } else if (subject === "שאלות") {
      questionObs.initAllQuestions().then(() => {
        setQuestions(questionObs.questionsList);
        setTableList(questionObs.questionsList);
        setSitesNames([]);
        let temp = [];
        questionObs.questionsList.map((question) => temp.push(question.locationName));
        setSitesNames(temp);
        setSitesNames([...new Set(temp)]);
        choosenObs = questionObs;
      });
    } else if (subject === "משתמשים") {
      userObs.initUsers().then(() => {
        setUsers(userObs.usersList);
        setTableList(userObs.usersList);
        choosenObs = userObs;
      });
    } else if (subject === "אתרים") {
      siteObs.initSites().then(() => {
        setSites(siteObs.SitesList);
        setTableList(siteObs.SitesList);
        choosenObs = siteObs;
      });
    } else if (subject === "נקודות עניין") {
      subSiteObs.initAllSubSites().then(() => {
        setSubSites([]);
        setTableList([]);
        setSubSites(subSiteObs.subSitesList);
        setTableList(subSiteObs.subSitesList);
        setSitesNames([]);
        let temp = [];
        subSiteObs.subSitesList.map((subSite) => temp.push(subSite.siteName));
        setSitesNames(temp);
        setSitesNames([...new Set(temp)]);
        choosenObs = subSiteObs;
      });
    } else {
      return;
    }
  }

  const classes = useStyles();

  //******* Handle Selects Filters AND table rows choosing by the user *******//
  const [isApproved, setIsApproved] = useState("הכל");
  const handleChangeSelect = (event) => {
    setIsApproved(event.target.value);
  };
  const [isAskedToBeCreator, setIsAskedToBeCreator] = useState("הכל");
  const handleChangeSelectUser = (event) => {
    setIsAskedToBeCreator(event.target.value);
  };
  const [siteName, setSiteName] = useState("הכל");
  const handleSiteNameChangeSelectUser = (event) => {
    setSiteName(event.target.value);
  };
  async function updateApproval() {
    choosenObs.approve(selectedList).then(() => {
      getSubject(subject);
    });
  }
  async function updatedDecline() {
    choosenObs.decline(selectedList).then(() => {
      getSubject(subject);
      setOpen(false);
    });
  }
  function selectFilter(value) {
    //return All
    if (isApproved === "הכל") return true;
    if (isApproved === true) {
      //Only objects whom already was approved
      return value.isApproved === true;
    } else if (isApproved === false) {
      //Only objects whom not yet was approved
      return value.isApproved === false;
    } else {
      console.log("error");
      return value.isApproved;
    }
  }
  function selectSiteFilter(value) {
    //return All
    if (siteName === "הכל") return true;
    //return only objects that is associated with selected site Name
    return siteName === value.siteName || siteName === value.locationName;
  }
  function isAskedFillter(value) {
    //All users:
    if (isAskedToBeCreator === "הכל") return true;
    //Only users who already was approved as creators:
    if (isAskedToBeCreator === true) {
      return value.isAskedToBeCreator === true;
    }
    //Only users who want to be creators:
    else {
      console.log("error!!!!");
      return value.isApproved;
    }
  }
  //********************************************************//

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="lg" dir="rtl">
        <HeroBg size={sizePage}>
          <ImageBg size={sizePage} />
        </HeroBg>
        <div className={classes.paper} style={{ padding: "2vh" }}>
          <Avatar className={classes.avatar}>
            <TravelExploreIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            אישור תכנים
          </Typography>
          <Typography component="h6" variant="h6">
            על מנת לצפות במידע בחלק זה, ראשית יש לבחור נושא
          </Typography>
          <br />
          {/* *************** Select filters***************** */}
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <div className="col-3" style={{ width: "300px" }}>
              <Box>
                <FormControl>
                  <InputLabel id="sites_names-select-label12">בחירת נושאים</InputLabel>
                  <Select
                    labelId="sites_names-select-label12"
                    id="sites_names-select-select"
                    value={topic}
                    defaultValue={topic}
                    sx={{ width: "210px", background: "white", opacity: "0.7" }}
                    onChange={(event, value) => getSubject(event.target.value)}
                  >
                    {optionList &&
                      optionList.map((option) => (
                        <MenuItem key={option} value={option} style={{ justifyContent: "flex-end" }}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="col-3" style={{ width: "300px" }}>
              {subject !== "אתרים" && subject !== "נקודות עניין" && (
                <Box>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">סינון לפי אושר או לא</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={isApproved}
                      sx={{ direction: "rtl", width: "170px", background: "white", opacity: "0.7" }}
                      onChange={handleChangeSelect}
                    >
                      <MenuItem value={"הכל"} style={{ justifyContent: "flex-end" }}>
                        הכל
                      </MenuItem>
                      <MenuItem value={true} style={{ justifyContent: "flex-end" }}>
                        מאושרים
                      </MenuItem>
                      <MenuItem value={false} style={{ justifyContent: "flex-end" }}>
                        טרם אושרו/סורבו
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </div>
            <div className="col-3" style={{ width: "300px" }}>
              {(subject === "נקודות עניין" || subject === "שאלות" || subject === "רמזים" || subject === "סיפורים" || subject === "משחקי חפש את המטמון") && (
                <Box>
                  <FormControl>
                    <InputLabel id="sites_names-select-label">סינון לפי שם אתר</InputLabel>
                    <Select
                      labelId="sites_names-select-label"
                      id="sites_names-select-select"
                      value={siteName}
                      sx={{ direction: "rtl", minWidth: "120px", background: "white", opacity: "0.7" }}
                      onChange={handleSiteNameChangeSelectUser}
                    >
                      <MenuItem value={"הכל"} style={{ direction: "rtl", justifyContent: "flex-end" }}>
                        הכל
                      </MenuItem>
                      {sitesNames &&
                        sitesNames.map((option) => (
                          <MenuItem key={option} value={option} style={{ direction: "rtl", justifyContent: "flex-end" }}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              {subject === "משתמשים" && (
                <Box>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label" sx={{ direction: "rtl" }}>
                      סינון לפי ביקש או לא
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={isAskedToBeCreator}
                      sx={{ direction: "rtl", width: "120px", background: "white", opacity: "0.7" }}
                      onChange={handleChangeSelectUser}
                    >
                      <MenuItem value={"הכל"} style={{ justifyContent: "flex-end" }}>
                        הכל
                      </MenuItem>
                      <MenuItem value={true} style={{ justifyContent: "flex-end" }}>
                        בקשו להיות יוצרים
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </div>
          </div>
          <br />
          {subject === "משחקי חפש את המטמון" && (
            <Typography component="h7" variant="h7" style={{ fontWeight: "bold" }}>
              אם ברצונכם לצפות בתוכן תחנה בתוך משחק יש ללחוץ על התחנה הרצויה במשחק עם העכבר
            </Typography>
          )}
          {/* *********************************************** */}
          {/* Table */}
          <Table celled compact definition dir="rtl">
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                {subject === "משתמשים" && (
                  <>
                    <Table.HeaderCell>שם</Table.HeaderCell>
                    <Table.HeaderCell>כתובת אימייל</Table.HeaderCell>
                    <Table.HeaderCell>תיאור המשתמש</Table.HeaderCell>
                    <Table.HeaderCell>סטטוס</Table.HeaderCell>
                  </>
                )}
                {subject === "רמזים" && (
                  <>
                    <Table.HeaderCell>רמז</Table.HeaderCell>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>שם נקודת העניין</Table.HeaderCell>
                    <Table.HeaderCell>סטטוס</Table.HeaderCell>
                  </>
                )}
                {subject === "סיפורים" && (
                  <>
                    <Table.HeaderCell>שם סיפור</Table.HeaderCell>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>שם נק' עניין</Table.HeaderCell>
                    <Table.HeaderCell>תוכן הסיפור</Table.HeaderCell>
                    {/* <Table.HeaderCell>קישור לתמונה </Table.HeaderCell> */}
                    <Table.HeaderCell>סטטוס</Table.HeaderCell>
                  </>
                )}
                {subject === "משחקי חפש את המטמון" && (
                  <>
                    <Table.HeaderCell>שם המשחק</Table.HeaderCell>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>תיאור המשחק</Table.HeaderCell>
                    <Table.HeaderCell>תחנות</Table.HeaderCell>
                    {/* <Table.HeaderCell>קישור לתמונה </Table.HeaderCell> */}
                    <Table.HeaderCell>סטטוס</Table.HeaderCell>
                  </>
                )}
                {subject === "שאלות" && (
                  <>
                    <Table.HeaderCell>השאלה</Table.HeaderCell>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>שם נקודת העניין</Table.HeaderCell>
                    <Table.HeaderCell>תשובות</Table.HeaderCell>
                    <Table.HeaderCell>תשובה נכונה</Table.HeaderCell>
                    <Table.HeaderCell>סטטוס</Table.HeaderCell>
                  </>
                )}
                {subject === "אתרים" && (
                  <>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>תיאור</Table.HeaderCell>
                  </>
                )}
                {subject === "נקודות עניין" && (
                  <>
                    <Table.HeaderCell>שם נקודת העניין</Table.HeaderCell>
                    <Table.HeaderCell>שם האתר</Table.HeaderCell>
                    <Table.HeaderCell>תיאור</Table.HeaderCell>
                    <Table.HeaderCell>כתובת url</Table.HeaderCell>
                  </>
                )}
              </Table.Row>
            </Table.Header>
            {subject === "משתמשים" && (
              <>
                <Table.Body>
                  {users &&
                    users
                      .filter(selectFilter)
                      .filter(isAskedFillter)
                      .map((option) => (
                        <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                          <Table.Cell collapsing>
                            <Checkbox
                              color="primary"
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>{option.firstName + " " + option.lastName}</Table.Cell>
                          <Table.Cell style={{ direction: "ltr" }}>{option.email}</Table.Cell>
                          <Table.Cell>{option.infoProfileValue}</Table.Cell>
                          <Table.Cell>{option.declined === true ? "מסורב" : option.isApproved ? "מאושר" : "לא מאושר"} </Table.Cell>
                        </Table.Row>
                      ))}
                </Table.Body>
              </>
            )}
            {subject === "רמזים" && (
              <>
                <Table.Body>
                  {clues &&
                    clues
                      .filter(selectFilter)
                      .filter(selectSiteFilter)
                      .map((option) => (
                        <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                          <Table.Cell collapsing>
                            <Checkbox
                              color="primary"
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>{option.clue}</Table.Cell>
                          <Table.Cell>{option.locationName}</Table.Cell>
                          <Table.Cell>{option.pointName}</Table.Cell>
                          <Table.Cell>{option.isApproved ? "מאושר" : "לא מאושר"} </Table.Cell>
                        </Table.Row>
                      ))}
                </Table.Body>
              </>
            )}
            {subject === "שאלות" && (
              <>
                <Table.Body>
                  {questions &&
                    questions
                      .filter(selectFilter)
                      .filter(selectSiteFilter)
                      .map((option) => (
                        <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                          <Table.Cell collapsing>
                            <Checkbox
                              color="primary"
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>{option.question}</Table.Cell>
                          <Table.Cell>{option.locationName}</Table.Cell>
                          <Table.Cell>{option.pointName}</Table.Cell>
                          <Table.Cell>
                            <Table.Row key={option.id} value={option} dir="rlt">
                              1. {option.answers[0]}
                            </Table.Row>
                            <Table.Row key={option.id} value={option} dir="rlt">
                              2. {option.answers[1]}
                            </Table.Row>
                            <Table.Row key={option.id} value={option} dir="rlt">
                              3. {option.answers[2]}
                            </Table.Row>
                            <Table.Row key={option.id} value={option} dir="rlt">
                              4. {option.answers[3]}
                            </Table.Row>
                          </Table.Cell>
                          <Table.Cell>{option.correctAnswer}</Table.Cell>
                          <Table.Cell>{option.isApproved ? "מאושר" : "לא מאושר"} </Table.Cell>
                        </Table.Row>
                      ))}
                </Table.Body>
              </>
            )}
            {subject === "סיפורים" && (
              <>
                <Table.Body>
                  {stories &&
                    stories
                      .filter(selectFilter)
                      .filter(selectSiteFilter)
                      .map((option) => (
                        <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                          <Table.Cell collapsing>
                            <Checkbox slider />
                          </Table.Cell>
                          <Table.Cell>{option.storyName}</Table.Cell>
                          <Table.Cell>{option.siteName}</Table.Cell>
                          <Table.Cell>{option.placeName}</Table.Cell>
                          <Table.Cell>{option.storyContent}</Table.Cell>
                          <Table.Cell>{option.isApproved ? "מאושר" : "לא מאושר"} </Table.Cell>
                        </Table.Row>
                      ))}
                </Table.Body>
              </>
            )}
            {subject === "משחקי חפש את המטמון" && (
              <>
                <Table.Body>
                  {treasureHunts &&
                    treasureHunts
                      .filter(selectFilter)
                      .filter(selectSiteFilter)
                      .map((option) => (
                        <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                          <Table.Cell collapsing>
                            <Checkbox slider />
                          </Table.Cell>
                          <Table.Cell>{option.quizName}</Table.Cell>
                          <Table.Cell>{option.siteName}</Table.Cell>
                          <Table.Cell>{option.description}</Table.Cell>
                          <Table.Cell>
                            {option?.gameList.map((station, idx) => (
                              <Table.Row
                                key={idx}
                                value={station}
                                dir="rlt"
                                onClick={() => {
                                  let placeName = station.placeName;
                                  let clue = station.nextclue;
                                  let question = station.question;
                                  handleClickInfoStation(placeName, clue, question);
                                }}
                                style={{ color: "blue" }}
                              >
                                {idx + 1}. {station.placeName}
                              </Table.Row>
                            ))}
                          </Table.Cell>
                          <Table.Cell>{option.isApproved ? "מאושר" : "לא מאושר"} </Table.Cell>
                        </Table.Row>
                      ))}
                </Table.Body>
              </>
            )}

            {subject === "אתרים" && (
              <>
                <Table.Body>
                  {sites &&
                    sites.map((option) => (
                      <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                        <Table.Cell collapsing>
                          <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>{option.siteName}</Table.Cell>
                        <Table.Cell>{option.description}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </>
            )}
            {/* Table after selected intrest point */}
            {subject === "נקודות עניין" && (
              <>
                <Table.Body>
                  {subSites &&
                    subSites.filter(selectSiteFilter).map((option) => (
                      <Table.Row key={option.id} value={option} dir="rlt" onClick={(event) => handleSelectAllClick(event, option)}>
                        <Table.Cell collapsing>
                          <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>{option.placeName}</Table.Cell>
                        <Table.Cell>{option.siteName}</Table.Cell>
                        <Table.Cell>{option.mainDescription[0]}</Table.Cell>
                        <Table.Cell style={{ direction: "ltr" }}>{option.barcode}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </>
            )}

            {/* Buttons and approve dialog before delete selected data if it optional */}
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="4">
                  <Button variant="outlined" onClick={handleClickOpen}>
                    {subject !== "אתרים" && subject !== "נקודות עניין" ? "סרב" : "מחק"}
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    style={{ textAlign: "right", direction: "rtl" }}
                  >
                    <DialogTitle id="alert-dialog-title">{"האם אתה בטוח?"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">לאחר פעולה זו, לא ניתן לחזור אחורה</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>ביטול</Button>
                      <Button onClick={updatedDecline} autoFocus>
                        אישור
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {dialogInfo}
                  {subject !== "אתרים" && subject !== "נקודות עניין" && (
                    <Button size="medium" onClick={updateApproval}>
                      אשר
                    </Button>
                  )}
                </Table.HeaderCell>
              </Table.Row>
               
            </Table.Footer>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default AprprovalTable;
