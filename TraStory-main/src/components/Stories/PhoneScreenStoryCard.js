import * as React from "react";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";

export default function PhoneScreenStoryCard(props) {
  const theme = useTheme();
  const [liked, setLiked] = useState(props.liked);
  const [likesnum, setLikesnum] = useState(props.likesnum);
  let userObs = props.userObs;
  let sID = props.sID;

  //handle press like/dislike by the registerd user
  const toggleLike = () => {
    if (userObs?.userInfo?.type === "registered" || userObs?.userInfo?.type === "creator" || userObs?.userInfo?.type === "admin") {
      setLikesnum(liked ? likesnum - 1 : likesnum + 1);
      setLiked(!liked);
      //update likes in DB
      userObs.updatesLikesStory(userObs.userInfo, sID, liked ? likesnum - 1 : likesnum + 1, !liked);
    }
  };

  return (
    <Card sx={{ display: "flex", width: "100%", minHeight: 140, maxHeight: 170 }} style={{ marginBottom: "1rem" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: 250 }}>
        <CardContent sx={{ flex: "0 0 auto" }}>
          <Typography component="div" fontSize={16} dir="rtl">
            {props.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" fontSize={13} dir="rtl">
            {props.author}
          </Typography>
          <Link
            to={{
              pathname: `/storycontent/${sID}`,
              state: {
                title: props.title,
                imgsrc: props.imgsrc,
                author: props.author,
                storyContent: props.istory,
                liked: liked,
                likesnum: likesnum,
              },
            }}
          >
            קרא עוד ...
          </Link>
          <div className="row">
            <div className="col-1" style={{ marginLeft: "10px" }}>
              {
                /*display of likes: likesnum- updated number of likes for the story
                   liked- boolean: true- full heart ; false-empty heart*/
                userObs?.userInfo?.type === "registered" || userObs?.userInfo?.type === "creator" || userObs?.userInfo?.type === "admin" ? (
                  <button className="likeBtn" onClick={toggleLike}>
                    {liked ? <FavoriteRoundedIcon style={{ color: "#b71c1c" }} /> : <FavoriteBorderRoundedIcon style={{ color: "#b71c1c" }} />}
                  </button>
                ) : (
                  <FavoriteRoundedIcon style={{ color: "#b71c1c" }} />
                ) // (icon לב)
              }
            </div>
            <div className="col-7" style={{ fontSize: "18px" }}>
              {likesnum}
            </div>
          </div>
        </CardContent>
      </Box>
      <CardMedia component="img" sx={{ width: 100, minHeight: 140, maxHeight: 180 }} image={props.imgsrc} alt="Live from space album cover" />
    </Card>
  );
}
