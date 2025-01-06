import React, { useState, useEffect } from "react";
import FullscreenStoryCard from "./FullScreenStoryCard";
import PhoneScreenStoryCard from "./PhoneScreenStoryCard";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import background from "../../images/viewBackground.jpeg";
import imageDef from "../../images/defualt.jpg";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";

// designing the main container//
const useStyles = makeStyles((theme) => ({
  Container: {
    opacity: 0.99999,
    zIndex: 50,
    minHeight: "83.7vh",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${background})`,

    "& .MuiSelect-select": {
      width: "160px",
      background: "white",
      opacity: "0.7",
      textAlign: "left",
      dir: "rtl",
      color: "black",
      fontSize: "1.15rem",
    },

    "& .MuiFormLabel-root": {
      color: "black",
      textAlign: "left",
      dir: "rtl",
      fontSize: "1.15rem",
    },
  },
}));

function DisplayStories(props) {
  const history = useHistory();

  const [stories, setStories] = useState([]);
  const [user, setUser] = useState();
  const storiesObs = props.reviewStore.storiesObs;
  let mb = window.innerHeight < 916 ? "5rem" : window.innerHeight / 38.5 + "rem";
  const classes = useStyles();
  const [sitesNames, setSitesNames] = useState([]);
  const siteObs = props.store.siteObs;
  const [siteName, setSiteName] = useState(props.selectedSite ? props.selectedSite : "הכל");

  const handleSiteNameChangeSelectUser = (event) => {
    setSiteName(event.target.value);
  };

  let pageTitle = "חיפוש סיפורים ";

  function storiesDisplay(user, stories) {
    let slist = [];
    let userSlist = user?.storyLikes;
    if (userSlist) {
      stories &&
        stories.map((item, idx) => {
          let tmpCheck = 0;
          for (let key in userSlist) {
            if (key.toString() === item.id.toString()) {
              tmpCheck = 1;
              item.liked = true;
              slist.push(item);
            }
          }
          if (tmpCheck !== 1) {
            item.liked = false;
            slist.push(item);
          }
        });
      return slist;
    }
  }

  useEffect(() => {
    siteObs.initSites().then(() => {
      let temp = [];
      siteObs.SitesList.map((site) => temp.push(site.siteName));
      setSitesNames(temp);
    });
  }, []);

  useEffect(() => {
    setUser(props.userObs.userInfo);
    setStories([]);
    storiesObs.initStories(true).then(() => {
      let arr = storiesObs.storiesList ? storiesObs.storiesList.filter((item) => item.isApproved) : [];
      setStories(storiesDisplay(props.userObs.userInfo, arr));
    });
  }, []);

  // function selectSiteFilter(value) {
  //   if (siteName === "הכל") return true;

  //   return siteName === value.siteName;
  // }

  return (
    <>
      {/* the main container */}
      <Container className={classes.Container} component="main" maxWidth={window.innerWidth <= 760 ? "xs" : "100%"} dir="rtl">
        {/* Stories Place Name/ stories for all places */}
        <Button size="small" variant="outlined" onClick={history.goBack} style={{ position: "absolute", left: "50px", marginTop: "30px", color: "#4d2800", borderRadius: "50px" }}>
          חזור ↩︎
        </Button>
        <div className="row text-right">
          <div className="col-3">
            <br />
            <h1 id="placeName" style={{ color: "#4d2800", fontFamily: "lucida grande", fontSize: "60px" }}>
              {" "}
              {pageTitle}
            </h1>
          </div>
        </div>
        <div className="row text-center">
          <div className=" col">
            <br />

            <Box>
              <FormControl>
                <InputLabel id="sites_names-select-label" sx={{ direction: "rtl" }}>
                  סינון לפי אתר
                </InputLabel>
                <Select labelId="sites_names-select-label" id="sites_names-select-select" value={siteName} variant="outlined" onChange={handleSiteNameChangeSelectUser}>
                  <MenuItem key={1} value={"הכל"} sx={{ direction: "rtl" }}>
                    הכל
                  </MenuItem>
                  {sitesNames &&
                    sitesNames.map((option) => (
                      <MenuItem key={option} value={option} sx={{ direction: "rtl" }}>
                        {option}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
        <div className="container-fluid d-flex justify-content-center" dir="rtl">
          <div className="row" id="StoriesCards" style={{ marginBottom: mb }}>
            {storiesObs.storiesList &&
              storiesObs.storiesList.map((itm, index) => {
                if (siteName === itm.siteName || siteName === "הכל") {
                  let filledCards =
                    window.innerWidth > 413 ? (
                      <div className="col">
                        <FullscreenStoryCard
                          sID={itm.id}
                          imgsrc={itm.imageURL ? itm.imageURL : imageDef}
                          title={itm.storyName}
                          author={itm.authorName}
                          istory={itm.storyContent}
                          storylink="storycontent"
                          liked={itm.liked}
                          likesnum={itm.storyLikesNum}
                          userObs={props.userObs}
                        />
                      </div>
                    ) : (
                      <div className="col">
                        <PhoneScreenStoryCard
                          sID={itm.id}
                          imgsrc={itm.imageURL ? itm.imageURL : imageDef}
                          title={itm.storyName}
                          author={itm.authorName}
                          istory={itm.storyContent}
                          storylink="storycontent"
                          liked={itm.liked}
                          likesnum={itm.storyLikesNum}
                          userObs={props.userObs}
                        />
                      </div>
                    );
                  return <>{filledCards}</>;
                }
              })}
          </div>
        </div>
      </Container>
    </>
  );
}

export default DisplayStories;
