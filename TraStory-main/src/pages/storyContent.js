import React, { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import Story from "../components/StoryContent";
import { createTheme } from "@material-ui/core/styles";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import { useParams } from "react-router-dom";
import { AuthProvider } from "../Contexts/AuthContexts";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

function Stories(props) {
  const [isOpen, setIsOpen] = useState(false);
  let { storyId } = useParams();
  let title;
  let author;
  let storyContent;
  let liked;
  let likesnum;
  let imgsrc;
  let userObs;

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  if (props?.location?.state !== undefined) {
    title = props.location.state.title;
    author = props.location.state.author;
    storyContent = props.location.state.storyContent;
    liked = props.location.state.liked;
    likesnum = props.location.state.likesnum;
    imgsrc = props.location.state.imgsrc;
  }
  userObs = props.userObs;

  return (
    <div id="storycontentPage" className="bodyStandart">
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <AuthProvider>
            {/* main component */}
            <Story title={title} author={author} storyContent={storyContent} liked={liked} likesnum={likesnum} imgsrc={imgsrc} userObs={userObs} sID={storyId} />
          </AuthProvider>
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
}

export default Stories;
