import React, { Component } from "react";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import "./styleSC.css";

class IconsP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: props.liked,
      likesnum: props.likesnum,
      storyContent: props.storyContent,
      path: props.path,
      userObs: props.userObs,
      sID: props.sID,
    };
  }

  //handle press like/dislike by the registerd user
  toggleLike = (state) => {
    let { likesnum, liked, userObs, sID } = this.state;
    likesnum = liked ? likesnum - 1 : likesnum + 1;
    liked = !liked;
    this.setState({
      likesnum: likesnum,
      liked: liked,
    });
    //update likes in DB
    userObs.updatesLikesStory(userObs.userInfo, sID, likesnum, liked);
  };

  render(state) {
    let { likesnum, liked, path, storyContent, userObs } = this.state;

    return (
      <div>
        <div className="scroll" dir="rtl">
          {storyContent}
        </div>
        <div className="row" justify-content="space-between" display="flex">
          <div className="col-8">
            {
              userObs?.userInfo?.type === "registered" || userObs?.userInfo?.type === "creator" || userObs?.userInfo?.type === "admin" ? (
                <button className="likeBtn" onClick={this.toggleLike}>
                  {liked ? <FavoriteRoundedIcon style={{ color: "#b71c1c" }} /> : <FavoriteBorderRoundedIcon style={{ color: "#b71c1c" }} />}
                </button>
              ) : (
                <FavoriteRoundedIcon style={{ color: "#b71c1c" }} />
              ) // (icon לב)
            }
            {likesnum}
          </div>
          <div className="col-3">
            <button className="backBtn" onClick={path}>
              חזור
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default IconsP;
