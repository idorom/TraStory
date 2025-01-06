import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import AddQuestion from "../components/AddQuestion";
import Store from "../stores/Store";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function AddQuestionPage(props) {
  const [isOpen, setIsOpen] = useState(false);
  const store = new Store();

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  let user = props.user;
  return (
    <div id="AddQuestionPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <AddQuestion store={store} user={user} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default AddQuestionPage;
