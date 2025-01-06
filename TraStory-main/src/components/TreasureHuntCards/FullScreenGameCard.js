import React, { Component } from "react";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import AuthorIcon from "@material-ui/icons/EditOutlined";
import "./card-style.css";
import { Link } from "react-router-dom";
import imageDef from "../../images/mapDef.jpg";
import Button from "@mui/material/Button";

class FullScreenGameCard extends Component {
  constructor(props) {
    super(props);
    console.log(props.likesnum);
    this.state = {
      liked: props.liked,
      likesnum: props.likesnum,
      imgsrc: props.imgsrc,
      title: props.title,
      author: props.author,
      description: props.description,
      storylink: props.storylink,
      user: props.user,
      userObs: props.userObs,
      thID: props.thID,
    };
    this.toggleLike = this.toggleLike.bind(this);
  }

  //handle press like/dislike by the registerd user
  toggleLike() {
    let { likesnum, user, userObs, thID, liked } = this.state;
    likesnum = liked ? likesnum - 1 : likesnum + 1;
    liked = !liked;

    this.setState({
      likesnum: likesnum,
      liked: liked,
    });
    //update likes in DB
    userObs.updatesLikesTH(userObs.userInfo, thID, likesnum, liked);
  }

  render() {
    let { likesnum, imgsrc, title, author, description, userObs, liked } = this.state;
    return (
      <div className="card text-center shadow">
        <div className="overflow">{imgsrc ? <img src={imgsrc} alt="image 1" className="card-img-top" /> : <img src={imageDef} alt="image 1" className="card-img-top" />}</div>
        <div className="card-body text-dark">
          {/* % <div> insted of <p>*/}
          <h4 className="card-title">{title}</h4>
          <div className="card-text text-secondary">
            <AuthorIcon style={{ color: "#e67700" }} /> {author}
            <br />
            {
              /*display of likes: likesnum- updated number of likes for the game
                   liked- boolean: true- full heart ; false-empty heart*/
              userObs?.userInfo?.type === "registered" || userObs?.userInfo?.type === "creator" || userObs?.userInfo?.type === "admin" ? (
                <button className="likeBtn" onClick={this.toggleLike}>
                  {this.state.liked ? <FavoriteRoundedIcon style={{ color: "#b71c1c" }} /> : <FavoriteBorderRoundedIcon style={{ color: "#b71c1c" }} />}
                </button>
              ) : (
                <FavoriteRoundedIcon style={{ color: "#b71c1c" }} />
              ) // (icon לב)
            }
            {likesnum}
          </div>
          <Link
            to={{
              pathname: `/treasureHunt/${this.state.thID}`,
              state: {
                fromCards: true,
              },
            }}
          >
            <Button variant="outlined" backgroundColor="#ffcc00">
              שחק עכשיו
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default FullScreenGameCard;
