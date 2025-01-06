import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import CreateGame from "../components/CreateGame";
import Store from "../stores/Store";
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function AddQuiz(props) {
  const [isOpen, setIsOpen] = useState(false);
  const store = new Store();
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let user = props.user;
  return (
    <>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <CreateGame store={store} user={user} />
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

export default AddQuiz;
