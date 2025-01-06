import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";
// import { Link as LinkS } from 'react-scroll';
import { FaTimes } from "react-icons/fa";
import background from "../../images/treasureBack.png";

export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  height: 100%;
  width: 100%;
  background-image: url(${background});
  // background: #3B2A1A;
  display: grid;
  align-items: center;
  top: 0;
  left: 0;
  transition: all 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "150%" : "0")};
  top: ${({ isOpen }) => (isOpen ? "0" : "-150%")};
  // top: 0;
`;

export const CloseIcon = styled(FaTimes)`
  color: #3b2a1a;
`;

export const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;

export const SidebarWrapper = styled.div`
  color: #fff;
`;

export const SidebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 80px);
  text-align: center;

  @media screen and (max-width: 413) {
    grid-template-rows: repeat(6, 60px);
  }
`;

export const SidebarLink = styled(LinkR)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  text-decoration: none;
  color: #734d26;
  cursor: pointer;

  &:hover {
    color: #c8b394;
    transition: 0.2s ease-in-out;
  }
`;

export const SidebarBtnWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export const SidebarRoute = styled(LinkR)`
  border-radius: 50px;
  background: #eae2b6;
  white-space: nowrap;
  padding: 16px 64px;
  color: #010606;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #7f8b52;
    color: #c8b394;
  }
`;
