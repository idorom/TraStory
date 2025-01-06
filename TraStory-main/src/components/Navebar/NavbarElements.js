import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
import { Link as LinkS } from "react-scroll";

export const Nav = styled.nav`
  background: ${({ scrollNav }) => (scrollNav ? "#C8B394" : "#C8B394")};
  height: 95px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  position: sticky;
  top: 0;
  z-index: 19;
  direction: rtl;
  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
  }
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 82px;
  z-index: 1;
  width: 100%;
  padding: 0 24px;
  max-width: 1500px;
`;

export const NavLogo = styled(LinkR)`
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-left: 24px;
  font-weight: bold;
  text-decoration: none;
`;

export const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transition: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: -22px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.li`
  height: 80px;
`;
export const NavLinks = styled(LinkR)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &:hover {
    transition: all 0.2s ease-in-out;
    color: #3b2a1a;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(LinkR)`
  border-radius: 90px;
  white-space: nowrap;
  font-size: 16px;
  display: flex;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #3b2a1a;
    color: #a12568;
  }
`;

export const LogParaphP = styled.p`
  border-radius: 90px;
  position: relative;
  buttom: 16px;
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  margin-bottom: 14px;
  outline: none;
  border: none;
  z-index: 10;
  cursor: pointer;
  text-decoration: none;
`;

/* Dropdown Menu */

// export const dropdown = styled.dropdown`
//   position: absolute;
//   top: 58px;
//   width: 300px;
//   transform: translateX(-45%);
//   background-color: var(--bg);
//   border: var(--border);
//   border-radius: var(--border-radius);
//   padding: 1rem;
//   overflow: hidden;
//   transition: height var(--speed) ease;
//   `;

//   export const menu= styled.menu`
//   width: 100%;
// `;

// export const menuItem = styled.menuitem`
//   height: 50px;
//   display: flex;
//   align-items: center;
//   border-radius: var(--border-radius);
//   transition: background var(--speed);
//   padding: 0.5rem;

//   &:hover{
//     background-color: #525357;
// }

// `;

// export const iconButton =styled.iconButton`
//   margin-right: 0.5rem;

//   &:hover{
//     transition: all 0.2s ease-in-out;
//     background: #fff;
//     color: #A12568;
// }
// `;
