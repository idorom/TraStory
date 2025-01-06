import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import "./style-ScanIntrestPointInfo.css";
import { HeroBg, ImageBg } from "./ScanIntrestPointInfoElement";
import Alert from "@material-ui/lab/Alert";
import QRreader from "../QRreader";

let sizePage = 0;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(sizePage / 10 - 1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
  },
}));

function ScanIntrestPointInfo(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const classes = useStyles();
  const history = useHistory();
  const toggleback = () => {
    history.push("/");
  };

  const parameters = {};

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg size={sizePage}>
          <ImageBg size={sizePage} />
        </HeroBg>
        <Grid item xs={12}>
          <Typography component="h3" variant="h3">
            דף סריקת נקודת עניין
          </Typography>
        </Grid>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <QRreader isURL={true} parameters={parameters} />
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
}

export default ScanIntrestPointInfo;
