import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import ScanIntrestPointInfo from "../components/ScanIntrestPointInfo";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { AuthProvider } from "../Contexts/AuthContexts";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function ScanIntrestPointInfos(props) {
  let score = 0;
  let qNum = 0;
  let prevAnswer = null;
  if (props?.location?.state !== undefined) {
    score = props.location.state.score;
    qNum = props.location.state.qNum;
    prevAnswer = props.location.state.prevAnswer;
  }
  // alert("page C: "+qNum);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div id="scanIntrestPointInfoPageStyle" className="bodyStandartHigher">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <AuthProvider>
            {/* main component */}
            <ScanIntrestPointInfo qNum={qNum} score={score} flag={false} prevAnswer={prevAnswer} boolStartGame={true} />
          </AuthProvider>
        </ThemeProvider>
      </StylesProvider>
      ,
    </div>
  );
}

export default ScanIntrestPointInfos;
