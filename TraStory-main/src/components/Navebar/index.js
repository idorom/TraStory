import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { animateScroll as scroll } from "react-scroll";
import ProfiePic from "../ProfiePic";
import { useAuth } from "../../Contexts/AuthContexts";
import { useHistory } from "react-router-dom";
import myLogo from "../../images/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import { NavDropdown } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks, NavBtnLink, NavBtn, LogParaphP } from "./NavbarElements";
import { createTheme } from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});
// designing the main container//
const useStyles = makeStyles((theme) => ({
  TheButton: {
    color: "#ffffff",
    fontSize: "20px",
    transition: "all 0.2s ease-in-out",
    fontWeight: "bold",
    fill: "#ffffff",
    icon: "#ffffff",
  },
  Item: {
    color: "#3B2A1A",
    fontSize: "17px",
    transition: "all 0.4s ease-in-out",
    fill: "#ffffff",
    icon: "#ffffff",
    justifyContent: "flex-start",
    direction: "rtl",
  },
}));

const Navbar = (props) => {
  const [scrollNav, setScrollNav] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  //array of pages that unSignIn user can't get acssess to
  const pageNeedAccessTo = ["activity", "addStory", "addQuiz", "addSite", "addIntrestPoint", "addClue", "addQuestion", "approveContent"];

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  const toggleHome = () => {
    scroll.scrollToTop();
  };
  const { currentUser, logout } = useAuth();
  const [user, setUser] = useState({ type: null });

  let logParaph = "התחברות";
  if (user) {
    logParaph = "שלום " + user.firstName;
  }

  useEffect(() => {
    setUser(
      !props.user
        ? null
        : { email: props.user?.email, firstName: props.user?.firstName, lastName: props.user?.lastName, ProfieImgURL: props.user?.ProfieImgURL, type: props.user?.type }
    );
    window.addEventListener("scroll", changeNav);
  }, [props.user]);

  async function logoutUser(e) {
    e.preventDefault();
    let bool = false;
    pageNeedAccessTo.forEach((element) => {
      //check if currnet page's url need access to signIn user
      if (window.location.href.includes(element)) {
        bool = true;
      }
    });
    props.userObs?.setUser(null);
    try {
      if (currentUser) {
        await logout().then(() => {
          //if currnet page's url need access after logout, it redirect user to Homa Page
          if (bool) {
            history.push("/");
          } else {
            //if currnet page's url not need access after logout, it reloa the page again
            window.location.reload(false);
          }
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <Nav scrollNav={scrollNav}>
        <NavbarContainer>
          <NavLogo to="/" onClick={toggleHome}>
            <img src={myLogo} />
          </NavLogo>

          <MobileIcon onClick={props.toggle}>
            <FaBars />
          </MobileIcon>

          <NavMenu>
            <NavItem>
              <NavLinks to="/stories" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                סיפורים
              </NavLinks>
            </NavItem>

            <NavItem>
              <NavLinks to="/treasureHuntSearch" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                מצא את המטמון
              </NavLinks>
            </NavItem>

            {/* Registered permision */}
            {!(user?.type === "admin" || user?.type === "creator" || user?.type === "registered") && (
              <NavItem>
                <NavLinks to="/signup" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                  הרשמה
                </NavLinks>
              </NavItem>
            )}
            {(user?.type === "admin" || user?.type === "creator" || user?.type === "registered") && (
              <NavItem>
                <NavLinks to="/activity" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                  פרופיל שלי
                </NavLinks>
              </NavItem>
            )}
            <NavItem>
              <NavLinks to="/almaInfo" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                אודתינו
              </NavLinks>
            </NavItem>

            {/* Admin permision */}
            {user?.type === "admin" && (
              <NavItem>
                <NavLinks to="/approveContent" smooth="true" duration={500} spy="true" exact="true" offset={-80}>
                  אישור תכנים
                </NavLinks>
              </NavItem>
            )}

            {/* Creator permision */}
            {(user?.type === "admin" || user?.type === "creator") && (
              <NavDropdown title={<span className={classes.TheButton}>הוספת תוכן</span>}>
                <NavDropdown.Item className={classes.Item} href="/addStory">
                  הוספת סיפור 📜
                </NavDropdown.Item>

                <NavDropdown.Item className={classes.Item} href="/addQuiz">
                  הוספת משחק מטמון 🕵️‍♀️
                </NavDropdown.Item>

                <NavDropdown.Item className={classes.Item} href="/addClue">
                  הוספת רמז 🔍
                </NavDropdown.Item>

                <NavDropdown.Item className={classes.Item} href="/addQuestion">
                  הוספת שאלה 🤔
                </NavDropdown.Item>

                {/* Admin permision */}
                {user?.type === "admin" && (
                  <NavDropdown.Item className={classes.Item} href="/addIntrestPoint">
                    הוספת נקודת עניין 📝
                  </NavDropdown.Item>
                )}
                {user?.type === "admin" && (
                  <NavDropdown.Item className={classes.Item} href="/addSite">
                    הוספת אתר 🗺
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            )}
          </NavMenu>

          {/* Registered permision */}
          {user?.type === "admin" || user?.type === "creator" || user?.type === "registered" ? (
            <>
              <div>
                <NavBtnLink to="/activity">
                  <ProfiePic sizeAvatar="30px" userURL={user?.ProfieImgURL} />
                </NavBtnLink>
                <LogParaphP style={{ color: "#3B2A1A", fontSize: "17px" }}>{logParaph}</LogParaphP>
              </div>
              <Button variant="text" onClick={logoutUser} style={{ color: "#3B2A1A" }}>
                התנתקות↩︎
              </Button>
            </>
          ) : (
            //Unregisterd user
            <>
              <div>
                <NavBtnLink to="/signin">
                  <ProfiePic sizeAvatar="30px" userURL={user?.ProfieImgURL} />
                </NavBtnLink>

                <LogParaphP style={{ color: "#3B2A1A", fontSize: "17px" }}>התחברות</LogParaphP>
              </div>
            </>
          )}
        </NavbarContainer>
      </Nav>
    </>
  );
};
export default Navbar;
