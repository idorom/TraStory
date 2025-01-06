import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Button } from "../components/ButtonElements";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import gil from "../images/gil.jpeg";
import ido from "../images/ido.JPG";
import maria from "../images/maria.jpeg";
import { useHistory } from "react-router-dom";

const cards = [1, 2, 3];

const theme = createTheme();

function toAlma(e) {
  e.preventDefault();
  window.open("http://alma.haifa.ac.il", "_blank");
}
function AboutUs() {
  const history = useHistory();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative"></AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: " #3B2A1A",
            pt: 1,
            pb: 4,
          }}
        >
          <Container maxWidth="sm">
            <Typography component="h2" variant="h3" align="center" color="#b36b00" fontWeight="bold" gutterBottom>
              עלמא
            </Typography>
            <Typography variant="h6" align="center" color="#e0c19e" fontWeight="bold" paragraph>
              עלמא הוא כלי דיגטאלי הכולל את כלל המידע על יהדות העולם העתיק לפי אתרים. הכלי הפועל על תשתית GIS מאפשר השוואה בין המפות העולות מחיבורים וקורפוסים שונים. עד כה מכיל
              הכלי את כלל ספרות חז"ל. באתר מצויים קישורים לטקסטים וניתן להרכיב מפות שונות והשוואתיות בין חיבורים ראשיים כמו משנה, מדרשי הלכה,מדרשי אגדה ותלמוד וכן בין מסכתות שונות.
              בימים אלו אנו משלימים את הכללת הממצא הארכיאולוגי שיש לו זיקה ליהודים, כמו גם את הספרות הרומית ביזנטית
            </Typography>
            <Stack sx={{ pt: 2 }} direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" onClick={toAlma}>
                לאתר ״עלמא״
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 5 }} maxWidth="md">
          <Typography component="h2" variant="h3" align="center" color="#b36b00" fontWeight="bold" gutterBottom style={{ direction: "rtl" }}>
            צוות פיתוח האתר
          </Typography>
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Grid item xs={13} sm={6} md={4}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: " #3B2A1A" }}>
                <CardMedia
                  component="img"
                  sx={{
                    // 16:9
                    pt: "0.1%",
                  }}
                  style={{ height: "26vh" }}
                  image={gil}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ direction: "rtl", color: "#e0c19e", fontWeight: "bold" }}>
                    גיל סלמנדר
                  </Typography>
                  <Typography style={{ direction: "rtl", color: "#ffc266" }}>
                    סטודנטית בחוג למערכות מידע וקוגניציה
                    <br />
                    אוניברסיטת חיפה
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            </Grid>

            <Grid item xs={13} sm={6} md={4}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: " #3B2A1A" }}>
                <CardMedia
                  component="img"
                  sx={{
                    // 16:9
                    pt: "0.1%",
                  }}
                  style={{ height: "26vh" }}
                  image={ido}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ direction: "rtl", color: "#e0c19e", fontWeight: "bold" }}>
                    עידו רום
                  </Typography>
                  <Typography style={{ direction: "rtl", color: "#ffc266" }}>
                    סטודנט בחוג למערכות מידע ולימודי אסיה
                    <br />
                    אוניברסיטת חיפה
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            </Grid>

            <Grid item xs={13} sm={6} md={4}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: " #3B2A1A" }}>
                <CardMedia
                  component="img"
                  sx={{
                    // 16:9
                    pt: "0.1%",
                  }}
                  style={{ height: "26vh" }}
                  image={maria}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ direction: "rtl", color: "#e0c19e", fontWeight: "bold" }}>
                    מריה נדאף
                  </Typography>
                  <Typography style={{ direction: "rtl", color: "#ffc266" }}>
                    עתודאית בחוג למערכות מידע
                    <br />
                    אוניברסיטת חיפה
                  </Typography>
                </CardContent>
                <CardActions></CardActions>
              </Card>
            </Grid>
          </Grid>
          <div>
            <Button size="small" onClick={history.goBack} style={{ position: "absolute", marginTop: "10px", marginBottom: "20px", height: "20px", width: "40px" }}>
              חזור ↩︎
            </Button>
          </div>
        </Container>
      </main>

      {/* End footer */}
    </ThemeProvider>
  );
}
export default AboutUs;
