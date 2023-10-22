import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
   palette: {
      mode: "dark",
      primary: {
         main: "#454f94",
         light: "#363e74",
      },
      secondary: {
         main: "#E65F2B",
      },
      error: { main: "#e23a23" },
      background: {
         default: "#1b1f3a",
         paper: "#292f57",
      },
   },
});
