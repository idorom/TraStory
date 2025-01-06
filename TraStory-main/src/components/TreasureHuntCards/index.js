import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/SearchRounded";
import FullScreenGameCard from "./FullScreenGameCard";
import PhoneScreenGameCard from "./PhoneScreenGameCard";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import background from "../../images/viewBackground.jpeg";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

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

function DisplayGames(props) {
  const [sitesNames, setSitesNames] = useState([]);
  const siteObs = props.store.siteObs;
  const [siteName, setSiteName] = useState(props.selectedSite ? props.selectedSite : "הכל");
  const [games, setGames] = useState([]);
  const [user, setUser] = useState();
  const gamesObs = props.reviewStore.treasureHuntObs;
  const history = useHistory();
  const handleSiteNameChangeSelectUser = (event) => {
    setSiteName(event.target.value);
  };

  useEffect(() => {
    siteObs.initSites().then(() => {
      let temp = [];
      siteObs.SitesList.map((site) => temp.push(site.siteName));
      setSitesNames(temp);
    });
  }, []);

  useEffect(() => {
    setUser(props.userObs.userInfo);
    setGames([]);
    gamesObs.initTreasureHunt(true).then(() => {
      setGames(gamesDisplay(props.userObs.userInfo, gamesObs.treasureHuntList));
    });
  }, []);

  function selectSiteFilter(value) {
    if (siteName === "הכל") return true;
    if (props.selectedSite) {
      return props.selectedSite === value.siteName;
    }
    return siteName === value.siteName;
  }

  function gamesDisplay(user, games) {
    let slist = [];
    let userSlist = user?.likedGames;
    if (userSlist) {
      console.log(games);
      games &&
        games.filter(selectSiteFilter).map((item, idx) => {
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

  const classes = useStyles();
  let pageTitle = "חיפוש משחקים ";
  let mb = window.innerHeight < 916 ? "5rem" : window.innerHeight / 38.5 + "rem";

  return (
    <Container className={classes.Container} component="main" maxWidth={window.innerWidth <= 760 ? "xs" : "100%"} dir="rtl">
      <Button size="small" variant="outlined" onClick={history.goBack} style={{ position: "absolute", left: "60px", marginTop: "30px", color: "#4d2800", borderRadius: "50px" }}>
        חזור ↩︎
      </Button>
      <div className="row text-right">
        <div className="col-3">
          <br />
          <h1 id="placeName" style={{ color: "#4d2800", fontFamily: "lucida grande", fontSize: "50px" }}>
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
              <Select
                labelId="sites_names-select-label"
                id="sites_names-select-select"
                value={siteName}
                // label="סינון"
                // sx={{ textAlign: "right" }}
                // className="MuiSelect-select"
                variant="outlined"
                onChange={handleSiteNameChangeSelectUser}
              >
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
      <div className="container-fluid d-flex justify-content-center">
        <div className="row" style={{ marginBottom: mb }}>
          {gamesObs.treasureHuntList &&
            gamesObs.treasureHuntList.map((itm, index) => {
              console.log(index, itm.description);
              if (siteName === itm.siteName || siteName === "הכל") {
                let filledCards =
                  window.innerWidth > 413 ? (
                    <div className="col">
                      <FullScreenGameCard
                        thID={itm.id}
                        imgsrc={itm.imageURL}
                        title={itm.quizName}
                        author={itm.authorName}
                        liked={itm.liked}
                        description={itm.description}
                        likesnum={itm.treasureHuntLikesNum}
                        user={user}
                        userObs={props.userObs}
                      />
                    </div>
                  ) : (
                    <div className="col">
                      <PhoneScreenGameCard
                        thID={itm.id}
                        imgsrc={itm.imageURL}
                        title={itm.quizName}
                        author={itm.authorName}
                        liked={itm.liked}
                        likesnum={itm.treasureHuntLikesNum}
                        userObs={props.userObs}
                      />
                    </div>
                  );

                return (
                  <>
                    {/* displaying (returning) the cards */}
                    {filledCards}
                  </>
                );
              }
            })}
        </div>
      </div>
    </Container>
  );
}

export default DisplayGames;
