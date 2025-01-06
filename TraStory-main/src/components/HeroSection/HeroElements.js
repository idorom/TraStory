import styled from "styled-components";
import { MdKeyboardArrowRight, MdArrowForward } from "react-icons/md";

export const HeroContainer = styled.div`
  background: #0c0c0c;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: calc(100vh - 20px);
  //height: 600px;
  position: relative;
  z-index: 14;

  :before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    rigth: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
    z-index: 2;
  }
`;

export const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const VideoBg = styled.video`
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  filter: brightness(70%);
  object-fit: cover;
  background: #232a34;
`;

export const HeroContent = styled.div`
  z-index: 3;
  max-width: 1200px;
  position: absolute;
  padding: 8px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeroH1 = styled.h1`
color: #fff;
font-size: 50px;
//font-weight: bold;
text-align:center;

@media screen and (max-width: 768px){
    font-size 40px;
}

@media screen and (max-width: 480px){
    font-size 32px;
}
`;

export const HeroP = styled.p`
margin-top: 20px;
color:#fff;
//border-radius: 30px ;
//background-color: #1a0d00;
font-size: 23px;
//opacity: 0.6;
 //padding: 8px 24px;
text-align: center;
max-width: 600px;

@media screen and (max-width: 768px){
    font-size 24px;
}

@media screen and (max-width: 480px){
    font-size 18px;
}
`;

export const A = styled.a`
  color: #fff;
`;

export const HeroBtnWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ArrowForward = styled(MdArrowForward)`
  margin-left: 8px;
  font-size: 20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
  margin-left: 8px;
  font-size: 20px;
`;
