import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

export default function ProfiePic(props) {
  const size = 52;
  const url = props.userURL;

  // designing the main container//
  const useStyles = makeStyles((theme) => ({
    avatar: {
      margin: theme.spacing(1),
      width: size,
      height: size,
      background: "#C8B394",
    },
  }));
  const classes = useStyles();
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#412F1D",
    borderRadius: "50px",
  };

  return (
    <div style={style}>
      {url ? <Avatar id="pic1Sub" className={classes.avatar} src={url} alt="Uploaded images" /> : <Avatar className={classes.avatar} src="/broken-image.jpg" />}
    </div>
  );
}
