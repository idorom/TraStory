import React, { useEffect, useRef } from "react";
import List from "@material-ui/core/List";
import t from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Badge } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useTheme from "@material-ui/core/styles/useTheme";
import ImageIcon from "@material-ui/icons/Image";

import("screw-filereader");
let imageExport;

//export the url of selected image
export function getURL() {
  return imageExport;
}

// designing the main container//
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  input: {
    fontSize: 15,
  },
  large: {
    width: "150px", //theme.spacing(25),
    height: "150px", //theme.spacing(25),
    border: `4px solid #4E3620`,
  },
}));

const EditIconButton = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    padding: 15,
    border: `2px solid #4E3620`,
  },
}))(IconButton);

export const AvatarPicker = (props) => {
  const [file, setFile] = React.useState("");
  const theme = useTheme();
  const classes = useStyles();

  const imageRef = useRef();

  const { handleChangeImage, avatarImage } = props;

  useEffect(() => {
    if (!file && avatarImage) {
      setFile(URL.createObjectURL(avatarImage));
    }

    return () => {
      if (file) URL.revokeObjectURL(file);
    };
  }, [file, avatarImage]);

  useEffect(() => {
    console.log(avatarImage);
    if (file && !avatarImage) {
      setFile("");
    }
  }, [avatarImage]);

  const renderImage = (fileObject) => {
    fileObject.image().then((img) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxWidth = 150;
      const maxHeight = 150;

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const width = (img.width * ratio + 0.5) | 0;
      const height = (img.height * ratio + 0.5) | 0;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, fileObject);
        setFile(URL.createObjectURL(resizedFile));
        handleChangeImage(resizedFile);
      });
    });
  };

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };

  const handleChange = (event) => {
    const fileObject = event.target.files[0];
    if (!fileObject) return;
    imageExport = event.target.files[0];
    renderImage(fileObject);
  };

  return (
    <List data-testid={"image-upload"}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 10px",
          color: "#B05E27",
        }}
      >
        <div className={classes.root}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            badgeContent={
              <EditIconButton onClick={showOpenFileDialog} style={{ background: "#FFE268", color: "#4E3620" }}>
                <EditIcon />
              </EditIconButton>
            }
          >
            {/* <div alt={"avatar"} src={file} className={classes.large} width="193" height="130" > </div> */}
            {file ? (
              <div alt={"avatar"} className={classes.large} width="193" height="130">
                <img src={file} />
              </div>
            ) : (
              <div>
                {/* <img src=myImage /> */}
                <ImageIcon className={classes.large} />
              </div>
            )}
          </Badge>
          <input ref={imageRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleChange} />
        </div>
      </div>
    </List>
  );
};
AvatarPicker.propTypes = {
  handleChangeImage: t.func.isRequired,
  avatarImage: t.object,
};
export default AvatarPicker;
