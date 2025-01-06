import styled from "styled-components";


export const HeroBg = styled.div`
position:absolute;
top:0;
right:0;
bottom: 0;
left:0;
width: 100%;
height:100%;
overflow: hidden;
opacity: 0.5;
z-index: -1;

`;

export const VideoBg = styled.video`
width: 100%;
height: 100%;
-o-object-fit: cover;
object-fit: cover;
background: #232a34;
opacity: 0.5;
z-index: -1;
`;