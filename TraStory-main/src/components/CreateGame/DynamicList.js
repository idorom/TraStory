import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";

let size = 12;

const DynamicList = (props) => {
  if (props.size) size = props.size;

  const [gameList, setGameList] = useState();

  //Handle delete of a station after user click on X button on the card station
  function delteItem(i, toast) {
    props.gameList.splice(i, 1);
    setGameList(
      props.gameList &&
        props.gameList.map((itm, i) => {
          return (
            <Toast
              key={i}
              onClose={() => {
                delteItem(i, this);
              }}
              show={true}
            >
              <Toast.Header>
                <strong className="me-auto" dir="rlt">
                  {" "}
                  {itm.pointIntrest.placeName}{" "}
                </strong>
              </Toast.Header>
              <Toast.Body>רמז: {itm.nextclue}</Toast.Body>
              <Toast.Body>שאלה: {itm.question}</Toast.Body>
            </Toast>
          );
        })
    );
    //Handle the reduce of station on the "props.gameList" by calling method on this canSave() "index" component
    props.canSave();
  }

  useEffect(() => {
    setGameList(
      props.gameList &&
        props.gameList.map((itm, i) => {
          return (
            <Toast
              key={i}
              onClose={() => {
                delteItem(i, this);
              }}
              show={true}
            >
              <Toast.Header>
                <strong className="me-auto" dir="rlt">
                  {" "}
                  {itm.pointIntrest.placeName}{" "}
                </strong>
              </Toast.Header>
              <Toast.Body>רמז: {itm.nextclue}</Toast.Body>
              <Toast.Body>שאלה: {itm.question}</Toast.Body>
            </Toast>
          );
        })
    );
  }, [props.gameList]);

  return <>{gameList}</>;
};

export default DynamicList;
