import styled from "styled-components";
import { Link as LinkR } from 'react-router-dom';
export const Button = styled(LinkR)`
border-radius: 50px; 
background: ${({primary}) => (primary ? '#C8B394' : '#C8B394')};
white-space: nowrap;
padding: ${({big}) => (big ? '14px 48px': '12px 30px')};
color: ${({dark}) => (dark ? '#3B2A19': '#fff')};
font-size: ${({fontBig}) => (fontBig ? '20px': '16px')};
outline: none;
font-weight: bold;
border:none;
cursor: pointer;
display:flex;
justify-content:center;
align-items: center;
transition: all 0.2s ease-in-out;

&:hover{
    transition: all 0.2s ease-in-out;
    background: ${({primary}) => (primary ? '#3B2A1A' :'#F3F2C9' )};
    color: #FE9A0F;
    font-weight: bold;
}
`;
