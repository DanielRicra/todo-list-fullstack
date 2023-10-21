import { createTheme } from "@mui/material/styles";
import { blue, indigo } from "@mui/material/colors";

export const darkTheme = createTheme({
   palette: {
      mode: "dark",
      primary: {
         main: "#262b51",
         light: "#363e74",
      },
      secondary: {
         main: "#E65F2B",
      },
      error: { main: "#e23a23" },
      background: {
         default: "#1b1f3a",
         paper: "#1b1f3a",
      },
   },
});

export const checkboxStyle = {
   color: blue[50],
   "&.Mui-checked": {
      color: indigo[100],
   },
   padding: "0",
};
