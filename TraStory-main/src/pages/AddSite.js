import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import AddSite from "../components/AddSite";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function AddSitePage(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="AddSitePageStyle" className="bodyStandart">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <AddSite />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default AddSitePage;
