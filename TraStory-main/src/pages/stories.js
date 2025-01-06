import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import StoriesComp from "../components/Stories";
import Store from "../stores/Store";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

const reviewStore = new Store();

function Stories(props) {
  const [isOpen, setIsOpen] = useState(false);
  const store = new Store();
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let selectedSite = props?.location?.state?.selectedSite ? props.location.state.selectedSite : null;
  return (
    <div id="storiesPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <StoriesComp reviewStore={reviewStore} userObs={props.userObs} store={store} selectedSite={selectedSite} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default Stories;
