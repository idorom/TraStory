import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import EditProfilePage from "./pages/EditProfile";
import ForgotPasswordPage from "./pages/ForgotPassword";
import TreasureHuntSearch from "./pages/treasureHuntCards";
import Stories from "./pages/stories";
import TresurHuntTamplateQuest from "./pages/TresurHuntTamplateQuestPage";
import TreasureHuntPage from "./pages/treasureHuntPage";
import AlmaInfo from "./pages/almaInfo";
import AddQuiz from "./pages/addQuiz";
import AddQuestion from "./pages/AddQuestion";
import AddClue from "./pages/AddClue";
import AddStory from "./pages/AddStory";
import Actprogress from "./pages/activityProgress";
import ApproveContentPage from "./pages/approveContet";
import InterstPointScanPage from "./pages/InterstPointScanPage";
import IntrestPointInfoPage from "./pages/IntrestPointInfoPage";
import AddSitePage from "./pages/AddSite";
import AddIntrestPointPage from "./pages/AddIntrestPoint";
import Footer from "./components/Footer";
import Navbar from "./components/Navebar";
import Sidebar from "./components/Sidebar";
import UserInfoStore from "./stores/UserInfoStore";
import { useAuth } from "./Contexts/AuthContexts";
import StoryContent from "./pages/storyContent";

const userInfoStore = new UserInfoStore();
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const { currentUser } = useAuth();

  const userObs = userInfoStore.userObs;
  const userUnregisteredObs = userInfoStore.userUnregisteredObs;
  const [user, SetUser] = useState();
  const [userUnregistered, SetUserUnregistered] = useState();

  const [type, setType] = useState(false);

  const [toDisplay, setToDisplay] = useState();
  useEffect(async () => {
    SetUser({});
    if (currentUser) {
      try {
        await userObs.signInUser(currentUser).then(() => {
          SetUser(userObs.userInfo);
          setType(userObs?.userInfo?.type);
          setToDisplay(true);
        });
      } catch (e) {
        console.log("error", e);
      }
    } else {
      try {
        SetUser();
        userUnregisteredObs.signInUser();
        SetUserUnregistered(userUnregisteredObs.userInfo);
        setToDisplay(true);
      } catch (e) {
        console.log("error", e);
      }
    }
  }, [currentUser]);

  console.log("refresh-app");

  return (
    <>
      <Router>
        <>
          <Sidebar isOpen={isOpen} toggle={toggle} user={user} userObs={userObs} />
          <Navbar toggle={toggle} user={user} userObs={userObs} />
          <div id="body1">
            <Switch>
              {/* Evreyone permision */}
              <Route path="/" component={() => <Home user={user} toDisplay={toDisplay} />} exact />
              <Route path="/almaInfo" component={AlmaInfo} exact />
              <Route path="/signin" component={SigninPage} exact />
              <Route path="/signup" component={SignupPage} exact />
              <Route path="/editProfile" component={() => <EditProfilePage user={user} />} exact />
              <Route path="/ForgotPassword" component={ForgotPasswordPage} exact />
              <Route path="/intrestPointScan" component={InterstPointScanPage} exact />
              <Route path="/intrestPointInfoPage/:siteID/:intrestPointID" component={IntrestPointInfoPage} exact />
              <Route path="/treasureHuntSearch" component={(props) => <TreasureHuntSearch {...props} userObs={user ? userObs : userUnregisteredObs} />} exact />
              <Route path="/stories" component={(props) => <Stories {...props} userObs={user ? userObs : userUnregisteredObs} />} exact />
              <Route path="/storycontent/:storyId" component={(props) => <StoryContent {...props} userObs={user ? userObs : userUnregisteredObs} />} exact />
              <Route path="/tresurHuntTamplateQuest" component={(props) => <TresurHuntTamplateQuest {...props} userObs={user ? userObs : userUnregisteredObs} />} exact />
              <Route
                path="/treasureHunt/:treasureHuntID"
                component={(props) => <TreasureHuntPage {...props} userObs={user ? userObs : userUnregisteredObs} inTreasureHuntObs={userInfoStore.inTreasureHuntObs} />}
                exact
              />

              {/* Registered permision */}
              {(type === "registered" || type === "creator" || type === "admin") && (
                <Route path="/activity" component={() => <Actprogress user={user} userObs={userObs} />} exact />
              )}

              {/* Creator permision */}
              {(type === "creator" || type === "admin") && <Route path="/addClue" component={() => <AddClue user={user} />} exact />}
              {(type === "creator" || type === "admin") && <Route path="/addQuestion" component={() => <AddQuestion user={user} />} exact />}
              {(type === "creator" || type === "admin") && <Route path="/addQuiz" component={() => <AddQuiz user={user} />} exact />}
              {(type === "creator" || type === "admin") && <Route path="/addStory" component={() => <AddStory user={user} />} exact />}

              {/* Admin permision */}
              {type === "admin" && <Route path="/addSite" component={() => <AddSitePage />} />}
              {type === "admin" && <Route path="/addIntrestPoint" component={() => <AddIntrestPointPage />} />}
              {type === "admin" && <Route path="/approveContent" component={ApproveContentPage} exact />}
            </Switch>
          </div>
          <Footer />
        </>
        {/* )} */}
      </Router>
    </>
  );
}

export default App;
