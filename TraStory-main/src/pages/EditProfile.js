import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import EditProfile from "../components/EditProfile";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function EditProfilePage(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  let user = props.user;
  return (
    <div id="signUpPageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          <EditProfile user={user} />
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default EditProfilePage;
