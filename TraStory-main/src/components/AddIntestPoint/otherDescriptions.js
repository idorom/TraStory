import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import Typography from "@material-ui/core/Typography";

let inputType = "text";
let size = 12;
let textExport;
let topicExport;

let textExportAlma;
let topicExportAlma;

let toExport = null;
let toExportAlma = null;

//export otherDescriptions info array to main component
export function getTopicText() {
  return checkInfo(toExport);
}

//export alma info array to main component
export function getTopicTextAlma() {
  return checkInfo(toExportAlma);
}

//if crad of info (Alma OR otherDescription) it will filter and not submited
function checkInfo(info) {
  if (info === null) return null;
  let temp = info?.filter((option) => {
    return option?.topic?.length > 0 && option?.text?.length > 0;
  });
  return temp?.length > 0 ? temp : null;
}

const OtherDescriptions = (props) => {
  if (props.inputType) inputType = props.inputType;
  if (props.size) size = props.size;

  const [arrOtherDescriptions, setArrOtherDescriptions] = React.useState(props.otherDescriptionsList);
  const [arrAlma, setArrAlma] = React.useState(props.almaList);
  const [arrTexTopicOtherDescriptions, setArrTexTopicOtherDescriptions] = React.useState([]);
  const [arrTexTopicAlma, setArrTexTopicAlma] = React.useState([]);
  const [arrAlmaTexTopic, setArrAlmaTexTopic] = React.useState([]);
  const [text, setText] = useState();
  const [topic, setTopic] = useState();
  const [textAlma, setTextAlma] = useState();
  const [topicAlma, setTopicAlma] = useState();

  //clear all states
  function clearAll() {
    setArrOtherDescriptions([]);
    setArrAlma([]);
    setArrTexTopicOtherDescriptions([]);
    setArrTexTopicAlma([]);
    setArrAlmaTexTopic([]);
    setText();
    setTopic();
    setTextAlma();
    setTopicAlma();
    toExport = null;
    toExportAlma = null;
  }

  //Handle changes in the filed called 'text' of OtherDescription card info
  const handleChangeText = (event, i) => {
    setText(event.target.value);
    textExport = event.target.value;
    if (!arrTexTopicOtherDescriptions[i]) {
      arrTexTopicOtherDescriptions[i] = {
        topic: "",
        text: "",
      };
    }
    arrTexTopicOtherDescriptions[i].text = event.target.value;
    toExport = arrTexTopicOtherDescriptions;
  };
  //Handle changes in the filed called 'topic' of OtherDescription card info
  const handleChangeTopic = (event, i) => {
    setTopic(event.target.value);
    topicExport = event.target.value;
    if (!arrTexTopicOtherDescriptions[i]) {
      arrTexTopicOtherDescriptions[i] = {
        topic: "",
        text: "",
      };
    }
    arrTexTopicOtherDescriptions[i].topic = event.target.value;
    toExport = arrTexTopicOtherDescriptions;
  };
  //Handle changes in the filed called 'text' of Alma card info
  const handleChangeTextAlma = (event, i) => {
    setTextAlma(event.target.value);
    textExportAlma = event.target.value;
    if (!arrTexTopicAlma[i]) {
      arrTexTopicAlma[i] = {
        topic: "",
        text: "",
      };
    }
    arrTexTopicAlma[i].text = event.target.value;
    toExportAlma = arrTexTopicAlma;
  };
  //Handle changes in the filed called 'topic' of Alma card info
  const handleChangeTopicAlma = (event, i) => {
    setTopicAlma(event.target.value);
    topicExportAlma = event.target.value;
    if (!arrTexTopicAlma[i]) {
      arrTexTopicAlma[i] = {
        topic: "",
        text: "",
      };
    }
    arrTexTopicAlma[i].topic = event.target.value;
    toExportAlma = arrTexTopicAlma;
  };

  //after submit clear the "otherDescriptionsList" AND "almaList"
  useEffect(() => {
    //clear arrays lists method
    clearAll();
  }, [props.isSubmited]);

  //Add other OtherDescription card info to fill
  const handleAdd = (event) => {
    setArrOtherDescriptions((arrOtherDescriptions) => [
      ...arrOtherDescriptions,
      <Grid item xs={12}>
        <Grid item xs={size}>
          <TextField
            type="text"
            key={arrOtherDescriptions.length}
            name={`topic`}
            variant="outlined"
            fullWidth
            label="נושא"
            onChange={(e) => handleChangeTopic(e, arrOtherDescriptions.length)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name={`text`}
            variant="outlined"
            multiline
            rows={8}
            key={arrOtherDescriptions.length}
            fullWidth
            type="text"
            label="תוכן*"
            onChange={(e) => handleChangeText(e, arrOtherDescriptions.length)}
          />
        </Grid>
      </Grid>,
    ]);
  };

  //Add other Alma card info to fill
  const handleAddAlma = (event) => {
    setArrAlma((arrAlma) => [
      ...arrAlma,
      <Grid item xs={12}>
        <Grid item xs={size}>
          <TextField type="text" key={arrAlma.length} name={props.topic} variant="outlined" fullWidth label="נושא" onChange={(e) => handleChangeTopicAlma(e, arrAlma.length)} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name={props.text}
            variant="outlined"
            multiline
            rows={8}
            key={arrAlma.length}
            fullWidth
            type="text"
            label="תוכן*"
            onChange={(e) => handleChangeTextAlma(e, arrAlma.length)}
          />
        </Grid>
      </Grid>,
    ]);
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        הוספת מידע נוסף על נקודת עניין
      </Typography>
      {arrOtherDescriptions}
      <Button item xs={12} type="button" onClick={handleAdd} variant="outlined" primary={true}>
        ➕ הוספת תכנים עם נושאים
      </Button>
      <Typography component="h1" variant="h5">
        הוספת מידע נוסף על נקודת עניין מעלמא
      </Typography>
      {arrAlma}
      <Button item xs={12} type="button" onClick={handleAddAlma} variant="outlined" primary={true}>
        ➕ הוספת תכנים מעלמא
      </Button>
    </>
  );
};

export default OtherDescriptions;
