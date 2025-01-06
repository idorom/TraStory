import styled from "styled-components";

export const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.5;
  z-index: -1;

  @media screen and (max-width: 1080px) {
    height: 100%;
  }

  @media screen and (max-width: 960px) {
    height: 100%;
  }

  @media screen and (max-width: 384px) {
    height: 100%;
  }
`;

export const VideoBg = styled.video`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  background: #232a34;
  opacity: 0.5;
  z-index: -1;
`;
