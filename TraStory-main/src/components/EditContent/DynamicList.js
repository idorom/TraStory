import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button} from "semantic-ui-react";

let size = 12;

const DynamicList = (props) => {
  const [itemsList, setItemsList] = useState();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  if (props.size) size = props.size;
  const [dialogItem, setDialogItem] = useState();
  const [itemIndex, setItemIndex] = useState();

  function delteItemDialog(itm, index) {
    setItemIndex(index);
    setDialogItem(itm);
    setOpen(true);
  }
  async function delteItem(itm, index) {
    let tmpItemContent;
    let tmpItemTitle;
    let itemId;
    await props.choosenObs.decline(itm).then(async () => {
      setOpen(false);
      props.itemsList.splice(index, 1);
      setItemsList(
        props.itemsList &&
          props.itemsList.map((itm, i) => {
            if (itm?.storyContent && itm?.storyContent) {
              tmpItemTitle = itm?.storyName;
              tmpItemContent = itm?.storyContent.slice(0, 200);
              itemId = itm.id;
            } else if (itm?.quizName && itm?.quizName) {
              tmpItemTitle = itm?.quizName;
              tmpItemContent = itm?.description.slice(0, 200);
              itemId = itm.id;
            } else if (itm?.clue && itm?.clue) {
              tmpItemTitle = null;
              tmpItemContent = itm?.clue.slice(0, 200);
              itemId = itm.id;
            } else {
              tmpItemContent = (
                <p>
                  תשובה 1: {itm?.answers} <br />
                  תשובה 2: {itm?.answers} <br />
                  תשובה 3: {itm?.answers} <br />
                  תשובה 4: {itm?.answers}
                </p>
              );
              tmpItemTitle = itm?.question;
              itemId = itm.id;
            }

            return (
              <Toast
                key={i}
                onClose={() => {
                  delteItemDialog(itm, i);
                }}
                show={true}
              >
                <Toast.Header>
                  <strong className="me-auto" dir="rlt">
                    {" "}
                    {tmpItemTitle}{" "}
                  </strong>
                </Toast.Header>
                <Toast.Body>{tmpItemContent}</Toast.Body>
              </Toast>
            );
          })
      );
    });
  }

  useEffect(() => {
    let tmpItemContent;
    let tmpItemTitle;
    let itemId;
    setItemsList(
      props.itemsList &&
        props.itemsList.map((itm, i) => {
          if (itm?.storyContent && itm?.storyContent) {
            tmpItemTitle = itm?.storyName;
            tmpItemContent = itm?.storyContent.slice(0, 200);
            itemId = itm.id;
          } else if (itm?.quizName && itm?.quizName) {
            tmpItemTitle = itm?.quizName;
            tmpItemContent = itm?.description.slice(0, 200);
            itemId = itm.id;
          } else if (itm?.clue && itm?.clue) {
            tmpItemTitle = null;
            tmpItemContent = itm?.clue.slice(0, 200);
            itemId = itm.id;
          } else {
            tmpItemContent = (
              <p>
                תשובה 1: {itm?.answers} <br />
                תשובה 2: {itm?.answers} <br />
                תשובה 3: {itm?.answers} <br />
                תשובה 4: {itm?.answers}
              </p>
            );
            tmpItemTitle = itm?.question;
            itemId = itm.id;
          }
          return (
            <Toast
              key={i}
              onClose={() => {
                delteItemDialog(itm, i);
              }}
              show={true}
            >
              <Toast.Header>
                <strong className="me-auto" dir="rlt">
                  {" "}
                  {tmpItemTitle}{" "}
                </strong>
              </Toast.Header>
              <Toast.Body>{tmpItemContent}</Toast.Body>
            </Toast>
          );
        })
    );
  }, [props.itemsList]);

  return (
    <>
      {itemsList}
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" style={{ textAlign: "right", direction: "rtl" }}>
        <DialogTitle id="alert-dialog-title">{"האם אתה בטוח?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">לאחר פעולה זו, לא ניתן לחזור אחורה</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button
            onClick={() => {
              delteItem(dialogItem, itemIndex);
            }}
            autoFocus
          >
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DynamicList;
