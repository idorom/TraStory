import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import IntrestPointInfo from "../components/IntrestPointInfo";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

import Store from "../stores/Store";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function InterstPointInfoPage(props) {
  let url = "";
  if (props?.location?.state !== undefined) {
    url = props.location.state.url;
  }

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  let store = new Store();
  return (
    <div id="interstPointInfoPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <IntrestPointInfo url={url} store={store} treasureHuntID={props?.location?.state?.treasureHuntID} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default InterstPointInfoPage;
