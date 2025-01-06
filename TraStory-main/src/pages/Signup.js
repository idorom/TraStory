import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import Signup from "../components/Signup";

import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function SignupPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="signUpPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <Signup isSignOrEdistor={"sign"} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default SignupPage;
