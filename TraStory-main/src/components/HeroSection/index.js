import React, { useState, useEffect } from "react";
import Video from "../../videos/video.mp4";
import SignIn from "../SignIn";
import { HeroContainer,
   HeroBg,
    VideoBg,
     HeroContent,
      HeroH1,
       HeroP,
        HeroBtnWrapper,
        A } from "./HeroElements";

const HeroSection = (props) => {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };

  var link = <A href="/almaInfo">עלמא</A>;
  
  return (
    <HeroContainer id="home">
      <HeroBg>
        <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
      </HeroBg>
      <HeroContent>
        <HeroH1> TraStory ברוכים הבאים לאתר הטיולים </HeroH1>
        <HeroP> בשיתוף עם פרוייקט {link} בראשות פרופ׳ אייל בן אליהו, הפקולטה למדעי הרוח </HeroP>
        <HeroBtnWrapper>
          {!(props.user?.type === "admin" || props.user?.type === "registered" || props.user?.type === "creator") && (
            <div style={{}}>
              <SignIn />
            </div>
          )}
        </HeroBtnWrapper>
      </HeroContent>
    </HeroContainer>
  );
  // }
};

export default HeroSection;
