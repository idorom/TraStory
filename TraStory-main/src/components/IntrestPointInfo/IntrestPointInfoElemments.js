import styled from "styled-components";
import {MdKeyboardArrowRight, MdArrowForward} from 'react-icons/md';
import img from "../../images/treasureBack.png"

export const HeroBg = styled.div`
position: absolute;
top:0;
right:0;
bottom: 0;
left:0;
width: 100%;
height:${props => props.size ? props.size+100: 100}%;
overflow: hidden;
opacity: 0.3;
z-index: -1;

@media screen and (max-width: 1080px) {
  height:${props => props.size ? props.size+100: 100}%;
}

@media screen and (max-width: 960px){
  height:${props => props.size ? props.size+100: 100}%;
}

@media screen and (max-width: 384px) {
  height:${props => props.size ? props.size+100: 100}%;
}

`;


export const ImageBg = styled.div`
position: absolute;
background-image: url(${props => props.img ? props.img : null});
top:0;
right:0;
bottom: 0;
left:0;
width: 100%;
height:${props => props.size ? props.size+100: 100}%;
background-position: center;
background-size: cover;
background-repeat: no-repeat;
-o-object-fit: cover;
object-fit: cover;
z-index: 1;
`;

export const ArrowForward = styled(MdArrowForward)`
margin-left: 8px;
font-size: 20px;

`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
margin-left: 8px;
font-size: 20px;
`;