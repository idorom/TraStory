import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ProgressBar = (props) => {
  const { pogress } = props;

  const containerStyles = {
    height: 30,
    width: "95%",
    backgroundColor: "#3B2A1A",
    borderRadius: 50,
    margin: 5,
  };

  const fillerStyles = {
    height: "100%",
    width: `${pogress.completed}%`,
    backgroundColor: "#B3541E",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "#5C3D2E",
  };

  return (
    <div>
      <br />
      <div dir="rtl" width="20%">
        <Link style={{ textDecoration: "#5C3D2E" }} to={{ pathname: `/treasureHunt/${pogress.thID}`, state: { fromCards: true } }}>
          <p style={{ color: "#5C3D2E", fontWeight: "bold", fontSize: "17px" }}>{pogress.bartitle} ←</p>
        </Link>
        <p style={{ fontWeight: "bold", fontSize: "14px" }}>הניקוד: {pogress.numOfQuestions + " / " + pogress.score}</p>
      </div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${pogress.completed}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

export const HeroBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 103%;
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
  opacity: 0.9;
  z-index: -1;
`;
