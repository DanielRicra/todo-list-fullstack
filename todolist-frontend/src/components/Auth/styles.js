import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
   palette: {
      mode: 'dark',
      primary: {
         light: '#FF925E',
         main: '#FF7844',
         dark: '#E65F2B',
         contrastText: '#e9e9e9',
      },
      secondary: {
         main: '#e1e1e1',
      },
      error: {
         main: '#f44336',
      },
   },
});
