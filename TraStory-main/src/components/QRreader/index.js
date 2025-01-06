import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import QrReader from "react-qr-reader";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const QRreader = (props) => {
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [isQRScan, setIsQRScan] = useState(false);
  const info = props.infoInizialize;
  const [isURL, setIsURL] = useState(props.isURL);
  const [textInfo, setTextInfo] = useState("");
  const history = useHistory();

  const commonStyles = {
    bgcolor: "background.paper",
    m: 10,
    border: 3,
    width: "5rem",
    height: "5rem",
  };

  const handleErrorWebCam = (error) => {
    console.log(error);
  };
  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
      setIsQRScan(true);

      if (isURL) handleURL(result);
      else handleTextInfo(result);
    }
  };

  let isCorrectScan = null;
  let isInGameMode = false;
  if (props.isInGameMode !== undefined) isInGameMode = props.isInGameMode;

  //Handle info data after sacnning
  function handleURL(result) {
    //Handle info data on game mode
    if (result === info && isInGameMode === true) {
      setTextInfo(<Alert severity="success">סרקת את ה-QR הנכון</Alert>);
      isCorrectScan = true;
      if (isInGameMode === true) {
        let answers = [];
        props.dataQuestions.answers.forEach((element) => {
          answers.push(element);
        });
        history.push({
          pathname: "/tresurHuntTamplateQuest",
          state: {
            score: props.parameters.score,
            qNum: props.parameters.qNum,
            flag: true,
            totalQuestions: props.totalQuestions,
            thID: props.parameters.treasureHuntID,
            answers: answers,
            correct: props.dataQuestions.correct,
            question: props.dataQuestions.question,
          },
        });
      }
    } //Handle info data not on game mode
    else if (isInGameMode === false) {
      let arrayPath = result.split("/");
      let sizeUrl = arrayPath.length;
      history.push({
        pathname: `/intrestPointInfoPage/${arrayPath[sizeUrl - 2]}/${arrayPath[sizeUrl - 1]}`,
        state: { url: result },
      });
    } else {
      setTextInfo(<Alert severity="error">סרקת את ה-QR הלא נכון</Alert>);
      isCorrectScan = false;
    }
  }

  //Alret notification after sacnning a barcod in the system
  function handleTextInfo(result) {
    if (result === info) setTextInfo(<Alert>סרקת את ה-QR הנכון</Alert>);
    else setTextInfo(<Alert>סרקת את ה-QR הלא נכון</Alert>);
  }

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ ...commonStyles, display: "inline", width: "80%", bgcolor: isQRScan && isURL && isCorrectScan ? "red" : "black" }}>
          {isQRScan && isURL ? textInfo : null} {/*Handle URL Scaned explanation's text for user*/}
          {isQRScan && !isURL ? textInfo : null} {/*Handle Text-Info Scaned explanation's text for user*/}
          <QrReader delay={300} onError={handleErrorWebCam} onScan={handleScanWebCam} showViewFinder={false} />
        </Box>
      </Grid>
    </>
  );
};

export default QRreader;
