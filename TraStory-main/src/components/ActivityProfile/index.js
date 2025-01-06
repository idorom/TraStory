import React, { useState, useEffect } from "react";
import ProgressBar, { HeroBg, VideoBg } from "./progressbarElement";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import GamesIcon from "@material-ui/icons/Games";
import Video from "../../videos/vide.mp4";
import { useHistory } from "react-router-dom";
import imageDef from "../../images/tree.jpeg";
import EditProfile from "../EditProfile";
import EditContent from "../EditContent";
import PhoneScreenActivityStoriesElements from "./PhoneScreenActivityStoriesElements";
import FullScreenActivityStoriesElements from "./FullScreenActivityStoriesElements";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "75vh",
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#E1701A",
    fontSize: "20px",
    borderRadius: "20px",
    width: "5rem",
    border: "none",
    color: "white",
    "&:hover": {
      transition: "all 0.2s ease-in-out",
      background: "#3B2A1A",
      color: "#FE9A0F",
      fontWeight: "bold",
    },
  },
}));

// Activity Profie function for exporting the component
function ActivityProfile({ user, reviewStore, userObs }) {
  let plist = [];

  let userSlist = user?.storyLikes;
  let mlist = user?.playedGames;

  const [subject, setSubject] = useState("התקדמות במשחקים");
  const [stories, setStories] = useState([]);
  const [screenType, setScreenType] = useState("xs");
  const storiesObs = reviewStore.storiesObs;
  const classes = useStyles();
  const userName = user?.firstName;
  const history = useHistory();
  const bgcolor = "#00695c";
  let mb = window.innerHeight;

  //change location to treasureHuntSearch page
  const routeChange = () => {
    let path = `/treasureHuntSearch`;
    history.push(path);
  };

  //intialize stories to the compoment from DB
  useEffect(async () => {
    await userObs.getNewLikesForUser().then(() => {
      userSlist = user?.storyLikes;
    });
    setStories([]);
    storiesObs.initStories().then(() => {
      let arr = storiesObs.storiesList.filter((item) => item.isApproved);
      setStories(arr);
    });
  }, []);

  //intialize data on screen by subject
  function getSubject(value, stype) {
    setSubject(value);
    setScreenType(stype);
  }

  //intialize list of games and their pogress
  const barsDisplay = () => {
    if (mlist) {
      for (let key in mlist) {
        if (mlist.hasOwnProperty(key)) {
          let tmp = {
            bgcolor: bgcolor,
            thID: key.toString(),
            completed: mlist[key].GameAdvance,
            bartitle: mlist[key].quizName,
            score: mlist[key].score,
            numOfQuestions: mlist[key].numOfQuestions,
          };
          plist.push(tmp);
        }
      }
    }
  };

  //intialize list of stories
  const storiesDisplay = () => {
    let slist = [];
    if (userSlist) {
      for (let key in userSlist) {
        stories.map((item, idx) => {
          if (key.toString() === item.id.toString()) {
            item.liked = true;
            slist.push(item);
          }
        });
      }
      setStories(slist);
    }
  };

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth={screenType}>
        <HeroBg>
          <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
        </HeroBg>
        <div className="row" dir="rtl">
          <div className="col-md-6" dir="rtl">
            <p style={{ fontSize: "1.6rem", opacity: "0.9", fontWeight: "bold", color: "#1B1A17" }}>שלום {userName}!</p>
          </div>
          <div className="col-md-6" dir="ltr">
            {user?.type === "registered" && (
              <>
                <button
                  style={{ background: "transparent", fontSize: "0.8rem", border: "none", opacity: "0.8", fontWeight: "bold" }}
                  onClick={() => {
                    getSubject("בקשה להיות יוצר", "xs");
                  }}
                >
                  {" "}
                  בקשה להיות יוצר
                  <EditIcon style={{ color: "#B85C38" }} />
                </button>
                <br />
              </>
            )}

            {(user?.type === "creator" || user?.type === "admin") && (
              <>
                <button
                  style={{ background: "transparent", fontSize: "0.8rem", border: "none", opacity: "0.8", fontWeight: "bold" }}
                  onClick={() => {
                    getSubject("עדכון תכנים", "xs");
                  }}
                >
                  עדכון תכנים
                  <EditIcon style={{ color: "#B85C38" }} />
                </button>
                <br />
              </>
            )}
            <button
              style={{ background: "transparent", fontSize: "0.8rem", border: "none", opacity: "0.8", fontWeight: "bold" }}
              onClick={() => {
                getSubject("הסיפורים שאהבתי", "lg");
                storiesDisplay();
              }}
            >
              הסיפורים שאהבתי <MenuBookIcon style={{ color: "#B85C38" }} />
            </button>
            <br />
            <button
              style={{ background: "transparent", fontSize: "0.8rem", border: "none", opacity: "0.8", fontWeight: "bold" }}
              onClick={() => {
                getSubject("התקדמות במשחקים", "xs");
              }}
            >
              {" "}
              המשחקים שלי
              <GamesIcon style={{ color: "#B85C38" }} />
            </button>
          </div>
        </div>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5" dir="rtl" style={{ color: "#5C3D2E", fontWeight: "bold", fontSize: "36px" }}>
            {subject}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {subject === "בקשה להיות יוצר" && user?.type === "registered" && user?.isApproved === false ? (
                user?.isAskedToBeCreator === false ? (
                  <div>
                    <EditProfile user={user} />
                  </div>
                ) : (
                  <div style={{ direction: "rtl", textAlign: "flex-start" }}>
                    <Typography component="h6" variant="h6" style={{ color: "#5C3D2E" }}>
                      סטטוס הבקשה שלך הינו:
                    </Typography>
                    <Typography component="h6" variant="h6" style={{ color: "#5C3D2E" }}>
                      {!user?.declined
                        ? " הינך נמצא/ת כרגע ברשימת המתנה, נציג מטעמנו יבדוק את בקשתך בהקדם"
                        : " שלום, לצערינו נאלצנו לוותר על תרומתך בשלב זה. אנו מודים על הרצון שלך לתרום לנו!"}
                    </Typography>
                  </div>
                )
              ) : null}

              {subject === "עדכון תכנים" && (
                <div>
                  <EditContent user={user} store={reviewStore} userObs={userObs} />
                </div>
              )}

              <div className={window.innerHeight < 916 ? "scroll" : ""}>
                {/* loop for creating the progress bars */}
                {subject === "התקדמות במשחקים" && (barsDisplay(), plist.map((item, idx) => <ProgressBar key={idx} bgcolor={"#B85C38"} pogress={item} />))}
                {subject === "הסיפורים שאהבתי" && window.innerHeight < 916 ? (
                  <div className="row">
                    {stories.map((item, idx) => (
                      <div className="col" key={idx}>
                        <PhoneScreenActivityStoriesElements
                          key={idx}
                          imgsrc={item.imageURL ? item.imageURL : imageDef}
                          title={item.storyName}
                          liked={item.liked}
                          likesnum={item.storyLikesNum}
                          istory={item.storyContent}
                          storyTitle={item.storyName}
                          author={item.authorName}
                          userObs={userObs}
                          sID={item.id}
                          storiesDisplay={storiesDisplay}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  subject === "הסיפורים שאהבתי" && (
                    <div className="row">
                      {stories.map((itm, idx) => (
                        <div className="col">
                          <FullScreenActivityStoriesElements
                            sID={itm.id}
                            imgsrc={itm.imageURL ? itm.imageURL : imageDef}
                            title={itm.storyName}
                            author={itm.authorName}
                            istory={itm.storyContent}
                            storylink="storycontent"
                            liked={itm.liked}
                            likesnum={itm.storyLikesNum}
                            userObs={userObs}
                          />
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
              <div className="row justify-content-center">
                {subject === "התקדמות במשחקים" ? (
                  <button className={classes.button} onClick={routeChange}>
                    +
                  </button>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
}
export default ActivityProfile;
