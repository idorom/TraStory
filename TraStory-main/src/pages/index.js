// import { BrowerRouter as Router } from 'express';
import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import { useHistory } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { createTheme } from "@material-ui/core/styles";
import ScrollToTop from "../components/ScrollToTop";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function Home(props) {
  const [isOpen, setIsOpen] = useState(false);

  const history = useHistory();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let user = props.user;
  return (
    <div id="HomePageStyle">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          {/* main component */}
          {props.toDisplay && <HeroSection user={user} toDisplay={props.toDisplay} />}
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default Home;
