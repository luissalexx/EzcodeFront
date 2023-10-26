import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const greyTheme = createTheme({
    palette: {
        primary: {
            main: '#282828'
        },
        secondary: {
            main: '#666666'
        },
        error: {
            main: red.A400
        }
    }
})