import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import ActivityProfile from "../components/ActivityProfile";
import Store from "../stores/Store";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { AuthProvider } from "../Contexts/AuthContexts";

const reviewStore = new Store();
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function ActProg(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let user = props.user;
  return (
    <div id="ActProg">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <AuthProvider>
            {/* main component */}
            <ActivityProfile user={user} reviewStore={reviewStore} userObs={props.userObs} />
          </AuthProvider>
        </ThemeProvider>
      </StylesProvider>
      ,
    </div>
  );
}

export default ActProg;
