import React, { Component } from "react";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AuthorIcon from "@material-ui/icons/EditOutlined";
import StoryDesc from "@material-ui/icons/MenuBookOutlined";
import { Link } from "react-router-dom";
import "./stories-style.css";

class FullscreenStoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: props.liked,
      likesnum: props.likesnum,
      imgsrc: props.imgsrc,
      title: props.title,
      author: props.author,
      istory: props.istory,
      sID: props.sID,
      user: props.user,
      userObs: props.userObs,
    };
    this.toggleLike = this.toggleLike.bind(this);
  }

  //handle press like/dislike by the registerd user
  toggleLike() {
    let { likesnum, user, userObs, sID, liked } = this.state;
    likesnum = liked ? likesnum - 1 : likesnum + 1;
    liked = !liked;

    this.setState({
      likesnum: likesnum,
      liked: liked,
    });
    //update likes in DB
    userObs.updatesLikesStory(userObs.userInfo, sID, likesnum, liked);
  }

  render() {
    let { likesnum, imgsrc, title, author, istory, sID, userObs } = this.state;
    return (
      <div className="card text-right shadow">
        <div className="overflow">
          <img src={imgsrc} alt="image 1" className="card-img-top" />
        </div>
        <div className="card-body text-dark">
          <h4 className="card-title text-center">{title}</h4>
          <div className="card-text text-secondary">
            <div className="row">
              <div className="col-1">
                <AuthorIcon style={{ color: "#e67700" }} />
              </div>
              <div className="col-11"> {author}</div>
            </div>
            <div className="row">
              <div className="col-1">
                <StoryDesc style={{ color: "#994f00" }} />
              </div>
              <div className="col-11">
                {istory.slice(0, 120)}
                <Link
                  to={{
                    pathname: `/storycontent/${sID}`,
                    state: {
                      title: title,
                      imgsrc: imgsrc,
                      author: author,
                      storyContent: istory,
                      liked: this.state.liked,
                      likesnum: likesnum,
                    },
                  }}
                >
                  קרא עוד ...
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-1">
                {
                  /*display of likes: likesnum- updated number of likes for the story
                   liked- boolean: true- full heart ; false-empty heart*/
                  userObs?.userInfo?.type === "registered" || userObs?.userInfo?.type === "creator" || userObs?.userInfo?.type === "admin" ? (
                    <button className="likeBtn" onClick={this.toggleLike}>
                      {this.state.liked ? <FavoriteRoundedIcon style={{ color: "#b71c1c" }} /> : <FavoriteBorderRoundedIcon style={{ color: "#b71c1c" }} />}
                    </button>
                  ) : (
                    <FavoriteRoundedIcon style={{ color: "#b71c1c" }} />
                  ) // (icon לב)
                }
              </div>
              <div className="col-7" style={{ fontSize: "15px" }}>
                {likesnum}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FullscreenStoryCard;
