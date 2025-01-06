import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { SidebarBtnWrap, SidebarContainer, SidebarLink, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarRoute } from "./SidebarElements";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";
const Sidebar = (props) => {
  const [user, setUser] = useState();
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  //array of pages that unSignIn user can't get acssess to
  const pageNeedAccessTo = ["activity", "addStory", "addQuiz", "addSite", "addIntrestPoint", "addClue", "addQuestion", "approveContent"];

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

  useEffect(() => {
    setUser(
      !user
        ? { email: "", firstName: "", lastName: "", ProfieImgURL: null }
        : { email: props.user?.email, firstName: props.user?.firstName, lastName: props.user?.lastName, ProfieImgURL: props.user?.ProfieImgURL }
    );

    console.log("type sidebar", props.user?.type);
  }, [props.user]);

  return (
    <SidebarContainer isOpen={props.isOpen} onClick={props.toggle}>
      <Icon onClick={props.toggle}>
        <CloseIcon></CloseIcon>
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          {/* Evreyone permision */}
          <SidebarLink to="/almaInfo" onClick={props.toggle}>
            אודותינו
          </SidebarLink>
          <SidebarLink to="/treasureHuntSearch" onClick={props.toggle}>
            מצא את המטמון
          </SidebarLink>
          <SidebarLink to="/stories" onClick={props.toggle}>
            סיפורים
          </SidebarLink>
          {props.user?.type === "registered" && (
            <>
              <SidebarLink to="/activity" onClick={props.toggle}>
                פרופיל שלי
              </SidebarLink>
            </>
          )}

          {/* Registered permision */}
          {!(user?.type === "admin" || user?.type === "creator" || user?.type === "registered") && (
            <SidebarLink to="/signup" onClick={props.toggle}>
              הרשמה
            </SidebarLink>
          )}

          {/* Creator permision */}
          {(props.user?.type === "admin" || props.user?.type === "creator") && (
            <>
              <SidebarLink to="/activity" onClick={props.toggle}>
                פרופיל שלי
              </SidebarLink>
              <SidebarLink to="/addStory" onClick={props.toggle}>
                הוספת סיפור
              </SidebarLink>
              <SidebarLink to="/addQuiz" onClick={props.toggle}>
                הוספת משחק מטמון
              </SidebarLink>
              <SidebarLink to="/addClue" onClick={props.toggle}>
                הוספת רמז
              </SidebarLink>
              <SidebarLink to="/addQuestion" onClick={props.toggle}>
                הוספת שאלה
              </SidebarLink>
            </>
          )}

          {/* Admin permision */}
          {props.user?.type === "admin" && (
            <>
              <SidebarLink to="/addSite" onClick={props.toggle}>
                הוספת אתר
              </SidebarLink>
              <SidebarLink to="/addIntrestPoint" onClick={props.toggle}>
                הוספת נקודת עניין
              </SidebarLink>
              <SidebarLink to="/approveContent" onClick={props.toggle}>
                אישור תכנים
              </SidebarLink>
            </>
          )}
        </SidebarMenu>

        {/* Registered permision */}
        {(props.user?.type === "admin" || props.user?.type === "creator" || props.user?.type === "registered") && (
          <Button onClick={logoutUser} style={{ color: "#fff", fontSize: "18px" }}>
            התנתקות↩︎
          </Button>
        )}
      </SidebarWrapper>
    </SidebarContainer>
  );
};
export default Sidebar;
