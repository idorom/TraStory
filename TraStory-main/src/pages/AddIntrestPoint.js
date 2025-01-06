import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import AddIntrestPoint from "../components/AddIntestPoint";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import Store from "../stores/Store";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function AddIntrestPointPage(props) {
  const store = new Store();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="AddIntrestPointPageStyle" className="bodyStandart">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <AddIntrestPoint store={store} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default AddIntrestPointPage;
