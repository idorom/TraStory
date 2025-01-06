import styled from "styled-components";
import './style-TreasureHunt.css';
import img from '../../images/tree.jpeg';

export const HeroBg = styled.div`
position:absolute;
top:0;
right:0;
bottom: 0;
left:0;
width: 100%;
height:${props => props.size ? props.size+100: 100}%;
overflow: hidden;
opacity: 0.25;
z-index: -1;
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