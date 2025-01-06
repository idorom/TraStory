import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const FooterContainer = styled.footer`
//background-color: #393e46; 
background-color: #3B2A1A; 
position: relative;
height: 57px;
margin: 0 auto;
bottom: 0;

@media screen and (max-width: 820px){
    height: 76px;
 
 }
 
`;
export const FooterWrap = styled.div`
//padding: 10px 5px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: 1100px;
margin: 0 auto;
`;

export const FooterLinkContainer = styled.div`
display: flex;
justify-content: center;

@media screen and (max-width: 820px){
    padding-top: 32px;
}
`;

export const FooterLinkWrapper = styled.div`
display: flex;

@media screen and (max-width: 820px){
    flex-direction: column;
}
`;

export const FooterLinkItems = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
margin: 10px;
text-align: left;
width: 160px;
box-sizing: border-box;
color: #fff;

@media screen and (max-width: 420px){
    margin:0;
    padding: 10px;
    width: 100%;
}
`;

export const FooterLinkTitle= styled.h1`
font-size: 14px;
// margin-bottom: 16px;

`;

export const FooterLink= styled(Link)`
color: #fff;
text-direction: none;
 margin-bottom: 1.6rem;
font-size: 14px;

&:hover{
    color: #B4B897;
    transition: 0.3 ease-out;
}

`;

export const SocialMedia = styled.section`
max-width: 10000px;
width: 100%;


`;

export const SocialMediaWrap = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
max-width: 1100px;
margin: 1px auto 0 auto;

@media screen and (max-width: 820px){
   flex-direction: column;

}

`;

export const SocialLogo = styled(Link)`
color: #fff;
justify-self: start;
cursor: pointer;
font:roboto slab;
text-decoration: none;
font-size: 1.5rem;
align-items: center;
// margin-bottom: 16px;
font-weight: bold; 
`;

export const WebsiteRights = styled.small`
color: #fff;
// margin-bottom: 16px;
`;

export const SocialIcons = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
width: 240px;

`;

export const SocialIconLink = styled.a`
color: #fff;
font-size: 24px;
`;
