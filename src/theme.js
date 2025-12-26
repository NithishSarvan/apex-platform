import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', sans-serif`,
  },
  palette: {
    primary: {
      main: "#20d6b2ff",      // Change this to your app primary color
      light: "#81ffe6ff",
      dark: "#08fccbff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#20d6b2ff",
    },
  },
});

export default theme;
