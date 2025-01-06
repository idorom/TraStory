import { HeroBg, ImageBg, ArrowForward, ArrowRight } from "./IntrestPointInfoElemments";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React, { useState, useEffect } from "react";
import CustomizedAccordions from "../CustomizedAccordions";
import { useParams } from "react-router-dom";
import { Button } from "../ButtonElements";
import ButtonMUI from "@mui/material/Button";
import imageDef from "../../images/tree.jpeg";
import { useHistory } from "react-router-dom";

export default function IntrestPointDataInfo({ store, treasureHuntID }) {
  console.log(treasureHuntID);
  const [IntrestPointInfo, SetIntrestPointInfo] = useState({});
  const [almaExpandedSize, SetAlmaExpandedSize] = useState(0);
  const history = useHistory();
  const { siteID, intrestPointID } = useParams();
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };

  const subSiteObs = store.subSiteObs;

  let isHasContent = false;
  //Initialized intrest point data from DB
  useEffect(async () => {
    SetIntrestPointInfo({});
    subSiteObs.initSubSite(siteID, intrestPointID).then(() => {
      SetIntrestPointInfo(subSiteObs.subSiteInfo);
    });
  }, []);

  let sizePage = 0;
  // designing the main container//
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginBottom: theme.spacing(sizePage),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    Container: {
      opacity: 0.99999,
      zIndex: 50,
    },
  }));
  const classes = useStyles();
  let image = IntrestPointInfo?.subSiteData?.imageURL ? IntrestPointInfo?.subSiteData?.imageURL : IntrestPointInfo?.siteData?.sitePhoto;

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="md" dir="rtl">
        <HeroBg size={sizePage}>
          <ImageBg size={sizePage} img={image ? image : imageDef} />
        </HeroBg>
        <CssBaseline />
        <div className={classes.paper}>
          {treasureHuntID && (
            <ButtonMUI
              size="small"
              variant="outlined"
              onClick={() =>
                history.push({
                  pathname: `/treasureHunt/${treasureHuntID}`,
                })
              }
              style={{ position: "absolute", left: "20px", marginTop: "25px", color: "#4d2800", borderRadius: "50px" }}
            >
              חזור למשחק ↩︎
            </ButtonMUI>
          )}

          <Avatar className={classes.avatar} style={{ backgroundColor: "#412F1D" }}>
            <TravelExploreIcon />
          </Avatar>
          <Typography component="h4" variant="h4">
            {IntrestPointInfo?.subSiteData?.placeName && IntrestPointInfo?.subSiteData?.placeName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h5" variant="h5">
                מידע כללי
              </Typography>
              {IntrestPointInfo?.subSiteData?.mainDescription &&
                IntrestPointInfo?.subSiteData?.mainDescription.map((itm, i) => {
                  return (
                    <>
                      <Typography key={i} variant="body1" gutterBottom style={{ fontSize: "1.2rem" }}>
                        {itm}
                      </Typography>
                      <br />
                    </>
                  );
                })}
            </Grid>
            <Grid item xs={12}>
              {(IntrestPointInfo?.subSiteData?.otherDescriptions || IntrestPointInfo?.subSiteData?.AlmaInfo) && (
                <>
                  <CustomizedAccordions
                    otherDescriptions={IntrestPointInfo?.subSiteData?.otherDescriptions}
                    AlmaInfo={IntrestPointInfo?.subSiteData?.AlmaInfo}
                    SetAlmaExpandedSize={almaExpandedSize}
                  />
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <Grid item xs={8} md={10}>
            <Button
              to={{ pathname: "/stories", state: { selectedSite: IntrestPointInfo?.subSiteData?.siteName } }}
              onMouseEnter={onHover}
              onMouseLeave={onHover}
              primary="true"
              dark="false"
              smooth="true" /* % smooth="true" spy="true"*/
              duration={500}
              spy="true" /* % smooth="true" spy="true"*/
              exact="true"
              offset={0}
            >
              סיפורים {hover ? <ArrowForward /> : <ArrowRight />}
            </Button>
          </Grid>
          <Grid item xs={8} md={5}>
            <br />
            <Button
              to={{ pathname: "/treasureHuntSearch", state: { selectedSite: IntrestPointInfo?.subSiteData?.siteName } }}
              onMouseEnter={onHover}
              onMouseLeave={onHover}
              primary="true"
              dark="true"
              smooth="true" /* % smooth="true" spy="true"*/
              duration={500}
              spy="true" /* % smooth="true" spy="true"*/
              exact="true"
              offset={0}
            >
              'משחקי 'חפש את המטמון {hover ? <ArrowForward /> : <ArrowRight />}
            </Button>
          </Grid>
        </div>
      </Container>
    </>
  );
}
