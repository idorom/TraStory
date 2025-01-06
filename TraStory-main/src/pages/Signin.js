import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import SignIn from "../components/SignIn";

import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function SigninPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="signInPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <SignIn inSignInPage={true} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default SigninPage;
