import styled from "styled-components";
import background from "../../images/treasureBack.png"

export const HeroBg = styled.div`
position: absolute;
top:0;
right:0;
bottom: 0;
left:0;
width: 100.5%;
height:130%;
overflow: hidden;
z-index: -1;



@media screen and (max-width: 1080px) {
    height:130%;
  }

@media screen and (max-width: 960px){
    height:130%;
  }

  @media screen and (max-width: 384px) {
    height:130%;
  }
`;

export const VideoBg = styled.video`
position: absolute;
background-image: url(${background});
top:0;
right:0;
bottom: 0;
left:0;
width: 100%;
height: 100%;
background-position: center;
background-size: cover;
background-repeat: no-repeat;
-o-object-fit: cover;
object-fit: cover;
z-index: -1;
`;