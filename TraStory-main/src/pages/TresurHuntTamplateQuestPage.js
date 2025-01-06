import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import TresurHuntTamplate from "../components/TresurHuntTamplate";

import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function TresurHuntTamplatePage(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  let score = 0;
  let qNum = 0;
  let thID;
  let dataQuestions;
  let answers;
  let correct;
  let question;
  let totalQuestions;

  //*********Handle pogress in the game of register and unregister user*********//
  if (props?.location?.state?.flag === true) {
    score = props.location.state.score;
    qNum = props.location.state.qNum;
    thID = props.location.state.thID;
    totalQuestions = props.location.state.totalQuestions;
    answers = props.location.state.answers;
    correct = props.location.state.correct;
    question = props.location.state.question;
    dataQuestions = { answers: answers, correct: correct, question: question };
  }
  //******************************************************//

  return (
    <div id="TresurHuntTamplateQuestPageStyle" className="bodyStandartHigher">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <TresurHuntTamplate myqNum={qNum} myScore={score} isOnlyQuiz={false} thID={thID} dataQuestions={dataQuestions} totalQuestions={totalQuestions} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default TresurHuntTamplatePage;
