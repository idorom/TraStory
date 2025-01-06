import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import ForgotPassword from "../components/ForgotPassword";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="forgotPasswordPageStyle" className="bodyStandart">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <ForgotPassword />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default ForgotPasswordPage;
