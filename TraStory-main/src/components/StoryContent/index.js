import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthorIcon from "@material-ui/icons/EditOutlined";
import IconsP from "./iconsPlus";
import "./styleSC.css";

let sizePage = 0;
// designing the main container//
const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(0),
    minHeight: "86vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Container: {
    opacity: 0.99999,
    zIndex: 50,
  },
}));

function StoryContent(props) {
  const classes = useStyles();
  const history = useHistory();

  const HeroBg = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${(props) => (props.VideoBg ? props.VideoBg + 100 : 100)}%;
    overflow: hidden;
    opacity: 0.25;
    z-index: -1;
  `;

  const VideoBg = styled.div`
    border: 1px solid #000;
    background-image: url(${props.imgsrc});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    -o-object-fit: cover;
    object-fit: cover;
    width: 100%;
    height: ${(props) => (props.VideoBg ? props.VideoBg + 100 : 100)}%;
  `;

  return (
    <>
      <Container className={classes.Container} component="main" maxWidth="xs" dir="rtl">
        <HeroBg size={sizePage}>
          <VideoBg size={sizePage} />
        </HeroBg>

        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5">
                {props.title}{" "}
              </Typography>
              <p className="author">
                <AuthorIcon style={{ color: "#e67700" }} />
                {props.author}
              </p>
              <IconsP
                liked={props.liked}
                likesnum={props.likesnum}
                storyContent={props.storyContent}
                path={history.goBack} //not more toggleback
                userObs={props.userObs}
                sID={props.sID}
              />
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
}

export default StoryContent;
