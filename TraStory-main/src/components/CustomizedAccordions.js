import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CustomizedAccordions(props) {
  const [expanded, setExpanded] = React.useState(false);
  const otherDescriptions = props.otherDescriptions;
  const AlmaInfo = props.AlmaInfo;
  console.log("props.AlmaInfo", props.AlmaInfo);

  //handle select diffrents tub panels: open one and close the others
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // //handle change of
  // const handleChangeAlma = (panel) => (event, isExpanded) => {
  //   props.SetAlmaExpandedSize(0);
  //   setExpanded(isExpanded ? panel : false);
  //   changeSizeForAlmeInfo(isExpanded);
  // };

  // //Helper method for alma tubs
  // const changeSizeForAlmeInfo = (isExpanded) => {
  //   if (!isExpanded) props.SetAlmaExpandedSize(0);
  //   else props.SetAlmaExpandedSize(AlmaInfo.length * 7);
  // };

  return (
    <>
      {otherDescriptions && (
        <Typography component="h5" variant="h5">
          מידע נוסף:
        </Typography>
      )}
      {otherDescriptions &&
        otherDescriptions.map((itm, i) => {
          let panelName = "panel" + (i + 1);
          return (
            <div key={i + 1 + "A"}>
              <Accordion expanded={expanded === panelName} onChange={handleChange(panelName)}>
                <AccordionSummary aria-controls={panelName + "bh-content"} id={panelName + "bh-header"}>
                  <Typography>{itm.topic}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{itm.text}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      {AlmaInfo && (
        <Typography component="h5" variant="h5">
          מידע מתוך עלמא:
        </Typography>
      )}
      {AlmaInfo &&
        AlmaInfo.map((itm, i) => {
          let panelName = "panel" + (i + 1) + "B";
          return (
            <div key={i + 1 + "B"}>
              <Accordion expanded={expanded === panelName} onChange={handleChange(panelName)}>
                <AccordionSummary aria-controls={panelName + "bh-content"} id={panelName + "bh-header"}>
                  <Typography>{itm.topic}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{itm.text}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
    </>
  );
}
