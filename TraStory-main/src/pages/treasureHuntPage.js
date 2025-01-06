import React, { useState, useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import TreasureHunt from "../components/TreasureHunt";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { AuthProvider } from "../Contexts/AuthContexts";
import { useParams } from "react-router-dom";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function TreasureHuntPage(props) {
  const [treasureHunt, setTreasureHunt] = useState(undefined);
  let { treasureHuntID } = useParams();
  const [bool, setBool] = useState(undefined);

  //*********Handle pogress in the game of register and unregister user*********//
  //beginning of new game data
  let score = 0;
  let qNum = 0;
  let prevAnswer = null;
  let isJustAnswerd = null;
  //IF user continue to play and and move from a riddle page
  if (props?.location?.state !== undefined && !props?.location?.state?.fromCards) {
    score = props.location.state.score;
    qNum = props.location.state.qNum;
    prevAnswer = props.location.state.prevAnswer;
    isJustAnswerd = props.location.state.isJustAnswerd;
    //IF user continue to play and and enter the url after taking a break in game
  } else if (props?.location?.state === undefined && props.userObs?.userInfo?.playedGames?.[`${treasureHuntID}`]) {
    score = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.score;
    qNum = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.qNum;
    prevAnswer = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.prevAnswer;
    isJustAnswerd = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.isJustAnswerd;
    //IF user continue to play and and move from the games menue page
  } else if (props?.location?.state?.fromCards && props.userObs?.userInfo?.playedGames?.[`${treasureHuntID}`]) {
    score = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.score;
    qNum = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.qNum;
    prevAnswer = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.prevAnswer;
    isJustAnswerd = props.userObs.userInfo?.playedGames[`${treasureHuntID}`]?.isJustAnswerd;
  }
  //******************************************************//

  //intialize treasure Hunt games to the compoment from DB
  useEffect(async () => {
    setTreasureHunt({});
    if (!props.treasureHunt || props?.location?.state?.fromCards) {
      try {
        await props.inTreasureHuntObs.initTreasureHunt(treasureHuntID).then(() => {
          setTreasureHunt(props.inTreasureHuntObs.getTreasureHunt);
          setBool(true);
        });
      } catch (e) {
        console.log("error", e);
      }
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div id="cluePageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <AuthProvider>
            {props?.inTreasureHuntObs?.getTreasureHunt !== null && bool === true ? (
              // main component //
              <TreasureHunt
                qNum={qNum}
                score={score}
                flag={false}
                prevAnswer={prevAnswer}
                boolStartGame={true}
                userObs={props.userObs}
                treasureHunt={props.inTreasureHuntObs.getTreasureHunt}
                treasureHuntID={treasureHuntID}
                isJustAnswerd={isJustAnswerd}
              />
            ) : null}
          </AuthProvider>
        </ThemeProvider>
      </StylesProvider>
      ,
    </div>
  );
}

export default TreasureHuntPage;
