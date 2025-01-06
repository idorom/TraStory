import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import Store from "../stores/Store";
import AprprovalTable from "../components/ApprovalTable";
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function ApproveContentPage(props) {
  const [isOpen, setIsOpen] = useState(false);
  const store = new Store();
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="AddSitePageStyle" className="bodyStandart">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <AprprovalTable store={store} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default ApproveContentPage;
