import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import Card from "../components/TreasureHuntCards";
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
const store = new Store();
function TreasureHuntSearch(props) {
  const [isOpen, setIsOpen] = useState(false);

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
          <Card reviewStore={reviewStore} userObs={props.userObs} store={store} selectedSite={selectedSite} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default TreasureHuntSearch;
